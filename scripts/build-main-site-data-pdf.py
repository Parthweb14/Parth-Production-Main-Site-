#!/usr/bin/env python3
"""Build Parth Production MAIN SITE DATA PDF in the same structure as
KADAM PRODUCTION MAIN SITE DATA (logo, red title, blue URL, blue headings,
red labels, short descriptions, then ADMIN section).
"""

from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor, black
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT_FILES = [
    ROOT / "Parth-Production-Main-Site-Data.pdf",
    ROOT / "docs" / "Parth-Production-Main-Site-Data.pdf",
]

RED = HexColor("#FF0000")
BLUE = HexColor("#0000FF")

PUBLIC_ITEMS = [
    (
        "Page Loader",
        "Page Loader: A loading screen with the Parth Production brand that plays while the homepage cinematic video gets ready, so the site opens smoothly.",
    ),
    (
        "Home Page",
        "Home Page: Displays a looping full-bleed cinematic background video, brand headline, Book and Services buttons, show videos, craft strip, and Stage Gallery highlights.",
    ),
    (
        "Services Page",
        "Services Page: Lists all the production setups you offer (Concerts, Weddings, Festivals, Corporate, Road Shows) with cover photos and direct WhatsApp book buttons.",
    ),
    (
        "Gallery Page",
        "Gallery Page: Showcases past event photographs in a spotlight and image ribbon, which clients can open fullscreen to view your work.",
    ),
    (
        "About Page",
        "About Page: Tells the Parth Production story, journey timeline, founder details, and why clients choose your studio.",
    ),
    (
        "Contact Page",
        "Contact Page: Shows WhatsApp, phone, email, and studio address, along with a Google Map pointing directly to your Surat studio.",
    ),
]

ADMIN_ITEMS = [
    (
        "Gallery Tab",
        "Gallery Tab: Upload new event photos, assign them categories (Weddings, Festivals, Concerts, Road Shows, Corporate), reorder, or delete old photos. Changes reflect on the public Gallery page.",
    ),
    (
        "Videos Tab",
        "Videos Tab: Add, reorder, or remove vertical show videos (up to 6) for the homepage video showcase. Changes update the scrollable video section on your Home page.",
    ),
    (
        "Services Tab",
        "Services Tab: Upload or replace the main display photo for each service block. Changes reflect immediately on the public Services page of the website.",
    ),
    (
        "Stage Gallery Tab",
        "Stage Gallery Tab: Update photos for the homepage Stage Gallery curve (maximum of 9 images). Changes update the animated stage showcase on the Home page.",
    ),
    (
        "Site Settings",
        "Site Settings: Edit phone, WhatsApp, email, and address used across the live website, plus SMTP email settings and admin login credentials.",
    ),
    (
        "SMTP",
        "SMTP Config: Edit Host, Port, Username, and Password settings for outgoing email dispatch. Enables password reset emails and admin email tools to work successfully.",
    ),
    (
        "Save Changes",
        "Save Changes: Saves your staged edits (photos, videos, settings) to the live website so customers see the updates.",
    ),
    (
        "Visit Live Site",
        "Visit Live Site: Opens the public website in a new tab so you can check what customers see after saving.",
    ),
    (
        "Logout",
        "Logout: Closes your admin session safely and returns you to the admin login screen.",
    ),
]


def prepare_logo() -> Path:
    for name in ("parth-logo.png", "logo.png", "Parth logo .png"):
        src = ROOT / "public" / name
        if src.exists():
            break
    else:
        raise SystemExit("No logo found in public/")

    img = Image.open(src).convert("RGBA")
    w, h = img.size
    side = max(w, h)
    square = Image.new("RGBA", (side, side), (255, 255, 255, 0))
    square.paste(img, ((side - w) // 2, (side - h) // 2), img)
    out = Path("/tmp/parth_logo_for_pdf.png")
    square.resize((400, 400), Image.Resampling.LANCZOS).save(out)
    return out


def wrap_text(c, text, font, size, max_width):
    words = text.split()
    lines = []
    cur = ""
    for word in words:
        test = (cur + " " + word).strip()
        if c.stringWidth(test, font, size) <= max_width:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def draw_centered(c, text, y, font, size, color):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawCentredString(letter[0] / 2, y, text)


def draw_desc(c, y, text, max_width=470):
    if ":" in text:
        label, rest = text.split(":", 1)
        label = label.strip() + ":"
        rest = rest.strip()
    else:
        label, rest = text, ""

    x_left = (letter[0] - max_width) / 2
    size = 12
    c.setFont("Helvetica-Bold", size)
    label_w = c.stringWidth(label + " ", "Helvetica-Bold", size)
    words = rest.split()
    first_max = max_width - label_w

    first_words = []
    for word in words:
        test = (" ".join(first_words + [word])).strip()
        if c.stringWidth(test, "Helvetica", size) <= first_max:
            first_words.append(word)
        else:
            break
    remaining = words[len(first_words) :]

    c.setFillColor(RED)
    c.setFont("Helvetica-Bold", size)
    c.drawString(x_left, y, label)
    c.setFillColor(black)
    c.setFont("Helvetica", size)
    c.drawString(x_left + label_w, y, " ".join(first_words))
    y -= 18

    for line in wrap_text(c, " ".join(remaining), "Helvetica", size, max_width):
        c.setFillColor(black)
        c.setFont("Helvetica", size)
        c.drawString(x_left, y, line)
        y -= 18
    return y - 8


def ensure_space(c, y, need):
    if y < need:
        c.showPage()
        return letter[1] - 72
    return y


def build(path: Path, logo_path: Path):
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter
    y = height - 70

    logo_w = logo_h = 140
    c.drawImage(
        str(logo_path),
        (width - logo_w) / 2,
        y - logo_h + 10,
        width=logo_w,
        height=logo_h,
        mask="auto",
        preserveAspectRatio=True,
        anchor="c",
    )
    y = y - logo_h - 8

    draw_centered(c, "PARTH PRODUCTION MAIN SITE", y, "Helvetica-Bold", 17, RED)
    y -= 28
    draw_centered(c, "(www.parthproduction.in)", y, "Helvetica-Bold", 16, BLUE)
    y -= 48

    for title, desc in PUBLIC_ITEMS:
        y = ensure_space(c, y, 90)
        draw_centered(c, title, y, "Helvetica-Bold", 16, BLUE)
        y -= 28
        y = draw_desc(c, y, desc)
        y -= 18

    y = ensure_space(c, y, 120)
    y -= 10
    draw_centered(c, "PARTH PRODUCTION ADMIN", y, "Helvetica-Bold", 17, RED)
    y -= 28
    draw_centered(c, "(www.parthproduction.in/admin)", y, "Helvetica-Bold", 16, BLUE)
    y -= 48

    for title, desc in ADMIN_ITEMS:
        y = ensure_space(c, y, 95)
        draw_centered(c, title, y, "Helvetica-Bold", 16, BLUE)
        y -= 28
        y = draw_desc(c, y, desc)
        y -= 18

    c.save()


def main():
    logo = prepare_logo()
    tmp = Path("/tmp/parth_main_site_data.pdf")
    build(tmp, logo)
    data = tmp.read_bytes()
    for out in OUT_FILES:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(data)
        print(f"wrote {out} ({len(data)} bytes)")


if __name__ == "__main__":
    main()
