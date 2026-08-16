import json
import sys
import time
from pathlib import Path
from typing import Any

from exif import Image
from geopy.exc import GeocoderServiceError
from geopy.geocoders import Nominatim

photos_folder = Path("public/photos")
photo_paths = [path for path in photos_folder.iterdir() if path.is_file()]


def gps_to_decimal(coordinates, reference):
    """Convert EXIF degrees/minutes/seconds to decimal degrees."""
    degrees, minutes, seconds = map(float, coordinates)
    decimal = degrees + minutes / 60 + seconds / 3600

    if isinstance(reference, bytes):
        reference = reference.decode()

    if reference.upper() in ("S", "W"):
        decimal = -decimal

    return decimal


def get_photo_coordinates(photo: Image):
    latitude = photo.get("gps_latitude")
    latitude_ref = photo.get("gps_latitude_ref")
    longitude = photo.get("gps_longitude")
    longitude_ref = photo.get("gps_longitude_ref")

    values = (latitude, latitude_ref, longitude, longitude_ref)
    if any(value is None for value in values):
        return None

    return (
        gps_to_decimal(latitude, latitude_ref),
        gps_to_decimal(longitude, longitude_ref),
    )


def get_photo_address(photo: Image):
    coordinates = get_photo_coordinates(photo)
    if coordinates is None:
        return None

    # Use a descriptive, unique user agent for Nominatim.
    geolocator = Nominatim(
        user_agent="saterz.dev-photo-manifest/1.0",
    )

    try:
        location = geolocator.reverse(
            coordinates,
            exactly_one=True,
            addressdetails=True,
        )
    except GeocoderServiceError as error:
        print(f"Reverse geocoding failed for {path}: {error}")
        return None

    if location is None:
        return None

    return location.raw.get("address", {})


def get_camera_model(exif_data: dict[str, Any]):
    make = exif_data.get("make")
    model = exif_data.get("model")

    if not make and not model:
        return None

    if make and model:
        if str(model).lower().startswith(str(make).lower()):
            return model

        return f"{make} {model}"

    return str(make or model)


def format_location(address):
    city = (
        address.get("city")
        or address.get("town")
        or address.get("village")
        or address.get("municipality")
    )
    region = address.get("state")
    country = address.get("country")
    return ", ".join(part for part in (city, region, country) if part is not None)


manifest = []

for path in photo_paths:
    entry = {}

    if path.suffix.lower() not in {".jpg"}:
        continue

    with open(path, "rb") as file:
        photo = Image(file)

    entry["src"] = f"/photos/{path.name}"
    entry["filename"] = path.name


    if photo.has_exif:
        exif_data = {tag: photo.get(tag) for tag in photo.list_all()}

        entry["takenAt"] = exif_data.get("datetime_original")
        entry["camera"] = get_camera_model(exif_data)
        entry["width"] = exif_data.get("image_width")
        entry["height"] = exif_data.get("image_height")
    else:
        print("The photo has no EXIF metadata")

    address = get_photo_address(photo)

    entry["location"] = format_location(address) if address else None

    manifest.append(entry)

with open("src/data/photo-manifest.json", "w") as manifest_file:
    json.dump(manifest, manifest_file)
