import { render } from "@testing-library/react-native";
import { LoadingView } from "../../../components/common";
import { ActivityIndicator } from "react-native";

describe("LoadingView", () => {
    it("shows the loading indicator", () => {
        const {UNSAFE_getByType} = render(<LoadingView/>);

        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
});