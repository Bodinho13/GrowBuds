import { render, screen } from "@testing-library/react-native";
import { EmptyState } from "../../../components/common"

describe("EmptyState", () => {
    it("shows the provided message", () => {
        render(<EmptyState message="Keine Pflanzen vorhanden."/>);

        expect(screen.getByText("Keine Pflanzen vorhanden.")).toBeTruthy();
    });

    it("shows a different message correctly", () => {
        render(<EmptyState message="Grow wurde nicht gefunden."/>);

        expect(screen.getByText("Grow wurde nicht gefunden.")).toBeTruthy();
    })
})