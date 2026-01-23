# Iphone API

Simple CRUD API built with FastAPI.

# RUN

pip install -r requirements.txt
uvicorn app.main:app --reload

## Endpoints

- GET /iphones  
  Get list of all iphones

- GET /iphones/{id}  
  Get iphone by id

- POST /iphones  
  Create new iphone

  Request body:
  
  json
{
  "iphone_name": "iphone 15",
  "capacity": 256,
  "weight": 180,
  "display": 7.0
}

- PUT /iphones/{id}  
  Update iphone by id

- DELETE /iphones/{id}  
  Delete iphone by id
