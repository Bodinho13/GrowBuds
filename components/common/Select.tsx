import { useState } from "react";
import { StyleSheet, View, Text, Pressable, Modal} from "react-native";
import { Radius, Spacing, Typography } from "../../theme";

type SelectProps<T> = {
    label: string;
    value: T;
    options: T[];
    getLabel: (value: T) => string;
    onChange: (value: T) => void;
};

export default function Select<T>({label, value, options, getLabel, onChange}: SelectProps<T>) {
    const [visible, setVisible] = useState(false);

    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <Pressable
                style={styles.input}
                onPress={() => setVisible(true)}
            >
                <Text>{getLabel(value)}</Text>
            </Pressable>

            <Modal
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.dropdown}>
                        {options.map((option) => (
                            <Pressable
                                key={getLabel(option)}
                                style={styles.option}
                                onPress={() => {
                                    onChange(option);
                                    setVisible(false);
                                }}
                            >
                                <Text>{getLabel(option)}</Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontWeight: "bold",
        marginTop: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.sm,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        padding: Spacing.md,
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.sm,
    },
    option: {
        padding: Spacing.md,
    },
});