from fastapi import FastAPI, HTTPException
from app.models import Iphone
from app.storage import load_iphones, save_iphones



iphones: list[dict] = load_iphones()

if iphones:
    next_id = max(iphone["id"] for iphone in iphones) + 1
else:
    next_id = 1

app = FastAPI()

# CREATE
@app.post("/iphones")
def add_iphone(iphone: Iphone):
    global next_id

    iphone_dict = iphone.model_dump()
    iphone_dict["id"] = next_id
    next_id += 1

    iphones.append(iphone_dict)
    save_iphones(iphones)

    return {"status": "added", "iphone": iphone_dict}

# READ (all)
@app.get("/iphones")
def get_iphones():
    return iphones


# READ (one)
@app.get("/iphones/{iphone_id}")
def get_iphone(iphone_id: int):
    for iphone in iphones:
        if iphone["id"] == iphone_id:
            return iphone
    raise HTTPException(status_code=404, detail="Iphone not found")


# UPDATE
@app.put("/iphones/{iphone_id}")
def update_iphone(iphone_id: int, updated: Iphone):
    for iphone in iphones:
        if iphone["id"] == iphone_id:
            data = updated.model_dump()
            data["id"] = iphone_id
            iphone.update(data)
            save_iphones(iphones)
            return {"status": "updated", "iphone": iphone}

    raise HTTPException(status_code=404, detail="Iphone not found")


# DELETE
@app.delete("/iphones/{iphone_id}")
def delete_iphone(iphone_id: int):
    for index, iphone in enumerate(iphones):
        if iphone["id"] == iphone_id:
            iphones.pop(index)
            save_iphones(iphones)
            return {"status": "deleted"}

    raise HTTPException(status_code=404, detail="Iphone not found")


