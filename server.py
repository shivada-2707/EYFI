from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Literal, Optional
import logging
import os
import uuid

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, Field
from starlette.middleware.cors import CORSMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class Milestone(BaseModel):
    label: str
    value: str
    complete: bool


class Participant(BaseModel):
    id: str
    rank: int
    name: str
    initials: str
    college: str
    city: str
    earned: int
    streak: int
    category: str
    color: str
    bio: str
    milestones: List[Milestone]


class LeaderboardResponse(BaseModel):
    participants: List[Participant]
    total: int
    updated: str


class EarningsCreate(BaseModel):
    participant_id: str
    amount: int = Field(gt=0, le=10000000)
    source: str = Field(min_length=2, max_length=80)
    note: str = Field(default="", max_length=240)


class EarningsStatusUpdate(BaseModel):
    status: Literal["approved", "rejected"]


class EarningsRecord(BaseModel):
    id: str
    participant_id: str
    participant_name: str
    amount: int
    source: str
    note: str
    status: str
    submitted_at: str


PARTICIPANTS = [
    {
        "id": "p1",
        "rank": 1,
        "name": "Aarav Menon",
        "initials": "AM",
        "college": "Christ University",
        "city": "Bengaluru",
        "earned": 48200,
        "streak": 18,
        "category": "Digital products",
        "color": "#c7f84a",
        "bio": "Turning campus problems into small, profitable digital products.",
        "milestones": [
            {"label": "First rupee", "value": "₹1", "complete": True},
            {"label": "₹10k club", "value": "₹10,000", "complete": True},
            {"label": "₹25k club", "value": "₹25,000", "complete": True},
            {"label": "₹50k club", "value": "₹50,000", "complete": False},
        ],
    },
    {
        "id": "p2",
        "rank": 2,
        "name": "Ishita Shah",
        "initials": "IS",
        "college": "NMIMS Mumbai",
        "city": "Mumbai",
        "earned": 42150,
        "streak": 16,
        "category": "Social media",
        "color": "#ffb6d7",
        "bio": "Helping local brands tell better stories through short-form video.",
        "milestones": [
            {"label": "First rupee", "value": "₹1", "complete": True},
            {"label": "₹10k club", "value": "₹10,000", "complete": True},
            {"label": "₹25k club", "value": "₹25,000", "complete": True},
            {"label": "₹50k club", "value": "₹50,000", "complete": False},
        ],
    },
    {
        "id": "p3",
        "rank": 3,
        "name": "Rohan Nair",
        "initials": "RN",
        "college": "SRM Institute",
        "city": "Chennai",
        "earned": 38700,
        "streak": 14,
        "category": "Food & craft",
        "color": "#a8e8ff",
        "bio": "Making weekend bakes and a whole lot of happy customers.",
        "milestones": [
            {"label": "First rupee", "value": "₹1", "complete": True},
            {"label": "₹10k club", "value": "₹10,000", "complete": True},
            {"label": "₹25k club", "value": "₹25,000", "complete": True},
            {"label": "₹50k club", "value": "₹50,000", "complete": False},
        ],
    },
    {
        "id": "p4",
        "rank": 4,
        "name": "Meera Krishnan",
        "initials": "MK",
        "college": "BITS Pilani",
        "city": "Hyderabad",
        "earned": 36400,
        "streak": 13,
        "category": "Consulting",
        "color": "#ffd36a",
        "bio": "Making research and strategy feel simpler for growing startups.",
        "milestones": [
            {"label": "First rupee", "value": "₹1", "complete": True},
            {"label": "₹10k club", "value": "₹10,000", "complete": True},
            {"label": "₹25k club", "value": "₹25,000", "complete": True},
            {"label": "₹50k club", "value": "₹50,000", "complete": False},
        ],
    },
    {
        "id": "p5",
        "rank": 5,
        "name": "Kabir Bansal",
        "initials": "KB",
        "college": "Delhi University",
        "city": "New Delhi",
        "earned": 33200,
        "streak": 11,
        "category": "Video editing",
        "color": "#d3c2ff",
        "bio": "Editing scroll-stopping reels between classes and chai breaks.",
        "milestones": [
            {"label": "First rupee", "value": "₹1", "complete": True},
            {"label": "₹10k club", "value": "₹10,000", "complete": True},
            {"label": "₹25k club", "value": "₹25,000", "complete": True},
            {"label": "₹50k club", "value": "₹50,000", "complete": False},
        ],
    },
    {
        "id": "p6",
        "rank": 6,
        "name": "Ananya Rao",
        "initials": "AR",
        "college": "St. Xavier's College",
        "city": "Kolkata",
        "earned": 29800,
        "streak": 10,
        "category": "Tutoring",
        "color": "#b8f1d0",
        "bio": "Helping school students find their confidence in mathematics.",
        "milestones": [
            {"label": "First rupee", "value": "₹1", "complete": True},
            {"label": "₹10k club", "value": "₹10,000", "complete": True},
            {"label": "₹25k club", "value": "₹25,000", "complete": True},
            {"label": "₹50k club", "value": "₹50,000", "complete": False},
        ],
    },
    {
        "id": "p7",
        "rank": 7,
        "name": "Dev Malhotra",
        "initials": "DM",
        "college": "VIT Vellore",
        "city": "Vellore",
        "earned": 27400,
        "streak": 9,
        "category": "No-code builds",
        "color": "#ffcab6",
        "bio": "Building useful little tools without waiting for permission.",
        "milestones": [
            {"label": "First rupee", "value": "₹1", "complete": True},
            {"label": "₹10k club", "value": "₹10,000", "complete": True},
            {"label": "₹25k club", "value": "₹25,000", "complete": True},
            {"label": "₹50k club", "value": "₹50,000", "complete": False},
        ],
    },
    {
        "id": "p8",
        "rank": 8,
        "name": "You · Nisha Verma",
        "initials": "NV",
        "college": "Ashoka University",
        "city": "Sonipat",
        "earned": 18450,
        "streak": 7,
        "category": "Resume studio",
        "color": "#c7f84a",
        "bio": "Making first impressions count for students ready to take the next step.",
        "milestones": [
            {"label": "First rupee", "value": "₹1", "complete": True},
            {"label": "₹10k club", "value": "₹10,000", "complete": True},
            {"label": "₹25k club", "value": "₹25,000", "complete": False},
            {"label": "₹50k club", "value": "₹50,000", "complete": False},
        ],
    },
]


@api_router.get("/")
async def root():
    return {"message": "EYFI leaderboard API is ready"}


@api_router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    view: str = Query("overall"),
    period: str = Query("all-time"),
    search: Optional[str] = None,
):
    rows = deepcopy(PARTICIPANTS)

    approved = await db.earnings.find(
        {"status": "approved"},
        {"_id": 0, "participant_id": 1, "amount": 1},
    ).to_list(1000)

    additions = {}
    for entry in approved:
        participant_id = entry["participant_id"]
        additions[participant_id] = (
            additions.get(participant_id, 0) + entry["amount"]
        )

    for row in rows:
        row["earned"] += additions.get(row["id"], 0)

    rows.sort(key=lambda participant: participant["earned"], reverse=True)

    for index, row in enumerate(rows, 1):
        row["rank"] = index

    if view == "college":
        rows = [
            participant
            for participant in rows
            if participant["college"]
            in {"Christ University", "NMIMS Mumbai", "Ashoka University"}
        ]

    if search:
        needle = search.lower()
        rows = [
            participant
            for participant in rows
            if needle in participant["name"].lower()
            or needle in participant["college"].lower()
            or needle in participant["category"].lower()
        ]

    if period == "weekly":
        rows = sorted(
            rows,
            key=lambda participant: participant["earned"] * 0.22,
            reverse=True,
        )
    elif period == "monthly":
        rows = sorted(
            rows,
            key=lambda participant: participant["earned"] * 0.72,
            reverse=True,
        )

    return {
        "participants": rows,
        "total": len(rows),
        "updated": "Today, 10:42 AM",
    }


@api_router.post("/earnings", response_model=EarningsRecord)
async def submit_earning(input: EarningsCreate):
    participant = next(
        (participant for participant in PARTICIPANTS
         if participant["id"] == input.participant_id),
        None,
    )

    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    record = {
        "id": str(uuid.uuid4()),
        "participant_id": input.participant_id,
        "participant_name": participant["name"].replace("You · ", ""),
        "amount": input.amount,
        "source": input.source,
        "note": input.note,
        "status": "pending",
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }

    await db.earnings.insert_one(record.copy())
    return record


@api_router.get("/earnings", response_model=List[EarningsRecord])
async def get_earnings(status: str = Query("pending")):
    query = {} if status == "all" else {"status": status}

    records = await db.earnings.find(
        query,
        {"_id": 0},
    ).sort("submitted_at", -1).to_list(1000)

    return records


@api_router.patch("/earnings/{earning_id}", response_model=EarningsRecord)
async def update_earning_status(
    earning_id: str,
    input: EarningsStatusUpdate,
):
    record = await db.earnings.find_one_and_update(
        {"id": earning_id},
        {"$set": {"status": input.status}},
        projection={"_id": 0},
        return_document=True,
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Earning entry not found",
        )

    return record


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()

    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find(
        {},
        {"_id": 0},
    ).to_list(1000)

    for check in status_checks:
        if isinstance(check["timestamp"], str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])

    return status_checks


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
