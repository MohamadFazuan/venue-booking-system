import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../VenueBookingApp.jsx";

describe("App — smoke tests", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(document.getElementById("root") || document.body).toBeTruthy();
  });

  it("shows Anjung brand name in the navbar", async () => {
    render(<App />);
    expect((await screen.findAllByText(/Anjung/i)).length).toBeGreaterThan(0);
  });

  it("shows hero headline on home page", async () => {
    render(<App />);
    expect(await screen.findByText(/Find the Perfect/i)).toBeInTheDocument();
  });

  it("shows featured venues section", async () => {
    render(<App />);
    expect(await screen.findByText(/Top-Rated Venues/i)).toBeInTheDocument();
  });
});

describe("App — navigation", () => {
  it("navigates to Browse Venues when clicking Browse Venues link", async () => {
    render(<App />);
    const user = userEvent.setup();
    const browseLink = (await screen.findAllByText(/Browse Venues/i))[0];
    await user.click(browseLink);
    expect(screen.getByText(/All Venues/i)).toBeInTheDocument();
  });

  it("shows all 6 mock venues on the venues page", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click((await screen.findAllByText(/Browse Venues/i))[0]);
    expect(screen.getByText("Grand Ballroom")).toBeInTheDocument();
    expect(screen.getByText("Conference Suite A")).toBeInTheDocument();
    expect(screen.getByText("Rooftop Terrace")).toBeInTheDocument();
    expect(screen.getByText("Garden Pavilion")).toBeInTheDocument();
    expect(screen.getByText("Auditorium Hall")).toBeInTheDocument();
    expect(screen.getByText("Executive Boardroom")).toBeInTheDocument();
  });

  it("navigates to venue detail on card click", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click((await screen.findAllByText(/Browse Venues/i))[0]);
    await user.click(screen.getByText("Grand Ballroom"));
    expect(screen.getByText(/Check Availability/i)).toBeInTheDocument();
  });

  it("navigates back to venues from detail page", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click((await screen.findAllByText(/Browse Venues/i))[0]);
    await user.click(screen.getByText("Grand Ballroom"));
    await user.click(screen.getByText(/Back to Venues/i));
    expect(screen.getByText(/All Venues/i)).toBeInTheDocument();
  });
});

describe("App — admin authentication", () => {
  it("shows admin login page when clicking Admin link", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(await screen.findByText(/^Admin$/i));
    expect(screen.getByPlaceholderText(/admin@venue.com/i)).toBeInTheDocument();
  });

  it("shows error on wrong credentials", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(await screen.findByText(/^Admin$/i));
    await user.type(screen.getByPlaceholderText(/admin@venue.com/i), "wrong@email.com");
    await user.type(screen.getByPlaceholderText(/••••••••/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /Sign In/i }));
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it("logs in with correct credentials and shows dashboard", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(await screen.findByText(/^Admin$/i));
    await user.type(screen.getByPlaceholderText(/admin@venue.com/i), "admin@venue.com");
    await user.type(screen.getByPlaceholderText(/••••••••/i), "admin123");
    await user.click(screen.getByRole("button", { name: /Sign In/i }));
    expect(await screen.findByText(/Total Bookings/i)).toBeInTheDocument();
  });
});

describe("App — admin booking management", () => {
  async function loginAsAdmin() {
    render(<App />);
    const user = userEvent.setup();
    await user.click(await screen.findByText(/^Admin$/i));
    await user.type(screen.getByPlaceholderText(/admin@venue.com/i), "admin@venue.com");
    await user.type(screen.getByPlaceholderText(/••••••••/i), "admin123");
    await user.click(screen.getByRole("button", { name: /Sign In/i }));
    await screen.findByText(/Total Bookings/i);
    return user;
  }

  it("shows bookings table on Bookings page", async () => {
    const user = await loginAsAdmin();
    await user.click(screen.getByText("Bookings"));
    expect(screen.getByText(/Reference/i)).toBeInTheDocument();
  });

  it("can approve a pending booking", async () => {
    const user = await loginAsAdmin();
    await user.click(screen.getByText("Bookings"));
    const approveButtons = screen.getAllByText("Approve");
    if (approveButtons.length > 0) {
      await user.click(approveButtons[0]);
      expect(screen.getAllByText("Approved").length).toBeGreaterThan(0);
    }
  });
});
