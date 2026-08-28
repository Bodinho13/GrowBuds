import { render, screen } from "@testing-library/react-native";
import { Section } from "../../../components/common";
import { Text } from "react-native";

describe("Section", () => {
    it("shows the section title", () => {
        render(<Section title="Allgemein"><></></Section>);

        expect(screen.getByText("Allgemein")).toBeTruthy();
    });

    it("renders its children", () => {
        render(<Section title="Allgemein"><Text>Startdatum</Text></Section>);

        expect(screen.getByText("Startdatum")).toBeTruthy();
    });

    it("renders multiple children", () => {
        render(<Section title="Anbau">
            <Text>Phase</Text>
            <Text>Medium</Text>
        </Section>);

        expect(screen.getByText("Phase")).toBeTruthy();
        expect(screen.getByText("Medium")).toBeTruthy();
    });
});