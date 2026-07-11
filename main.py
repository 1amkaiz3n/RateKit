import json
import os
from pathlib import Path
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
STATIC_DIR = BASE_DIR / "static"

DATA_DIR.mkdir(exist_ok=True)
STATIC_DIR.mkdir(exist_ok=True)

def init_data():
    files = {
        "settings.json": {"target_salary": 5000000, "working_days": 22, "productive_hours": 6, "profit_margin": 30},
        "expenses.json": [],
        "projects.json": []
    }
    for filename, data in files.items():
        filepath = DATA_DIR / filename
        if not filepath.exists():
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)

init_data()

def load_json(filename):
    with open(DATA_DIR / filename, 'r') as f:
        return json.load(f)

def save_json(filename, data):
    with open(DATA_DIR / filename, 'w') as f:
        json.dump(data, f, indent=2)

def get_settings():
    return load_json("settings.json")

def update_settings(data):
    s = get_settings()
    s.update(data)
    save_json("settings.json", s)
    return s

def get_expenses():
    return sorted(load_json("expenses.json"), key=lambda x: x.get('order', 0))

def add_expense(name, amount):
    exps = get_expenses()
    new_id = max((e.get('id', 0) for e in exps), default=0) + 1
    e = {"id": new_id, "name": name, "amount": amount, "order": len(exps)}
    exps.append(e)
    save_json("expenses.json", exps)
    return e

def update_expense(expense_id, name=None, amount=None):
    exps = get_expenses()
    for e in exps:
        if e['id'] == expense_id:
            if name: e['name'] = name
            if amount: e['amount'] = amount
            save_json("expenses.json", exps)
            return e
    return None

def delete_expense(expense_id):
    exps = [e for e in get_expenses() if e['id'] != expense_id]
    for i, e in enumerate(exps):
        e['order'] = i
    save_json("expenses.json", exps)
    return True

def get_projects():
    return sorted(load_json("projects.json"), key=lambda x: x.get('created_at', ''), reverse=True)

# ─── Core Calculation Functions (Single Source of Truth) ────────────────

def calculate_base_hourly_rate():
    settings = get_settings()
    total_monthly = settings['target_salary'] + sum(e['amount'] for e in get_expenses())
    monthly_hours = settings['working_days'] * settings['productive_hours']
    if monthly_hours == 0:
        monthly_hours = 1
    return total_monthly / monthly_hours

def calculate_selling_hourly_rate():
    base = calculate_base_hourly_rate()
    margin = get_settings()['profit_margin']
    return base * (1 + margin / 100)

def calculate_project_total(hours, additional_cost=0):
    rate = calculate_selling_hourly_rate()
    return rate * hours + additional_cost

def calculate_recommended_price(total):
    return int((total + 49999) // 50000) * 50000

# ─── Project ────────────────────────────────────────────────────────────

def add_project(name, hours, additional_cost=0):
    total_price = calculate_project_total(hours, additional_cost)
    rec_price = calculate_recommended_price(total_price)
    projects = get_projects()
    project = {
        "id": len(projects) + 1,
        "project_name": name,
        "estimated_hours": hours,
        "additional_cost": additional_cost,
        "created_at": datetime.now().isoformat(),
        "total_price": total_price,
        "recommended_price": rec_price
    }
    projects.append(project)
    save_json("projects.json", projects)
    return project

def delete_project(project_id):
    projects = [p for p in get_projects() if p['id'] != project_id]
    save_json("projects.json", projects)
    return True

# ─── FastAPI App ────────────────────────────────────────────────────────

app = FastAPI(title="RateKit")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/")
async def root():
    return HTMLResponse(open(BASE_DIR / "templates" / "index.html").read())

@app.get("/api/settings")
def api_settings():
    return get_settings()

@app.put("/api/settings")
def api_update_settings(data: dict):
    return update_settings(data)

@app.get("/api/expenses")
def api_expenses():
    return get_expenses()

@app.post("/api/expenses")
def api_add_expense(data: dict):
    return add_expense(data['name'], data['amount'])

@app.put("/api/expenses/{expense_id}")
def api_update_expense(expense_id: int, data: dict):
    r = update_expense(expense_id, data.get('name'), data.get('amount'))
    if not r:
        raise HTTPException(404, "Not found")
    return r

@app.delete("/api/expenses/{expense_id}")
def api_delete_expense(expense_id: int):
    delete_expense(expense_id)
    return {"success": True}

@app.get("/api/hourly-rate")
def api_hourly_rate():
    settings = get_settings()
    total_expenses = sum(e['amount'] for e in get_expenses())
    total_monthly = settings['target_salary'] + total_expenses
    monthly_hours = settings['working_days'] * settings['productive_hours']
    if monthly_hours == 0:
        monthly_hours = 1
    base = total_monthly / monthly_hours
    sell = base * (1 + settings['profit_margin'] / 100)
    return {"hourly_rate": base, "final_rate": sell, "total_monthly": total_monthly, "monthly_productive_hours": monthly_hours}

@app.get("/api/calculate-project")
def api_calculate(estimated_hours: float, additional_cost: float = 0):
    rate = calculate_selling_hourly_rate()
    total = calculate_project_total(estimated_hours, additional_cost)
    rec = calculate_recommended_price(total)
    return {"final_rate": rate, "estimated_hours": estimated_hours, "additional_cost": additional_cost, "total_price": total, "recommended_price": rec}

@app.get("/api/projects")
def api_projects():
    return get_projects()

@app.post("/api/projects")
def api_add_project(data: dict):
    return add_project(data['project_name'], data['estimated_hours'], data.get('additional_cost', 0))

@app.delete("/api/projects/{project_id}")
def api_delete_project(project_id: int):
    delete_project(project_id)
    return {"success": True}

@app.post("/api/projects/{project_id}/duplicate")
def api_duplicate_project(project_id: int):
    projects = get_projects()
    p = next((x for x in projects if x['id'] == project_id), None)
    if not p:
        raise HTTPException(404, "Not found")
    new = p.copy()
    new['id'] = len(projects) + 1
    new['project_name'] = p['project_name'] + " (Copy)"
    new['created_at'] = datetime.now().isoformat()
    projects.append(new)
    save_json("projects.json", projects)
    return new

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
