import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import Select from "../../../components/common/Select";

const options = ["Samen", "Vegetative Phase", "Blüte"];

function renderSelect(onChange = jest.fn()) {
    return render(
        <Select
            label="Grow-Phase"
            value="Samen"
            options={options}
            getLabel={(value) => value}
            onChange={onChange}
        />,
    );
}

describe("Select", () => {
    it("shows the label and current value", () => {
        renderSelect();

        expect(screen.getByText("Grow-Phase")).toBeTruthy();
        expect(screen.getByText("Samen")).toBeTruthy();
    });

    it("opens the options when pressed", () => {
        renderSelect();

        fireEvent.press(screen.getByText("Samen"));

        expect(screen.getByText("Vegetative Phase")).toBeTruthy();
        expect(screen.getByText("Blüte")).toBeTruthy();
    });

    it("calls onChange with the selected option", () => {
        const onChange = jest.fn();
        renderSelect(onChange);

        fireEvent.press(screen.getByText("Samen"));

        fireEvent.press(screen.getByText("Vegetative Phase"));

        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith("Vegetative Phase");
    });

    it("closes the options after selecting an option", async () => {
        const onChange = jest.fn();
        renderSelect(onChange);

        fireEvent.press(screen.getByText("Samen"));
        await waitFor(() => {
            expect(screen.getByText("Blüte")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Blüte"));
        await waitFor(() => {
            expect(screen.queryByText("Vegetative Phase")).toBeNull();
        });
        expect(onChange).toHaveBeenCalledWith("Blüte");
    });
});
