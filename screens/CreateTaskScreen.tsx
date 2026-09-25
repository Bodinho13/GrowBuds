import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { TaskStackParamList } from "../navigation/types";
import { useServices } from "../services/ServicesContext";
import { Grow } from "../types/Grow";
import { TaskUrgency } from "../types/TaskUrgency";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Select from "../components/common/Select";
import { Colors, Radius, Spacing, Typography } from "../theme";

type Props = NativeStackScreenProps<TaskStackParamList, "CreateTask">;

export default function CreateTaskScreen({ navigation }: Props) {
    const { growService, taskService } = useServices();

    const [grows, setGrows] = useState<Grow[]>([]);
    const [selGrow, setSelGrow] = useState<Grow | undefined>();
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState(new Date());
    const [urgency, setUrgency] = useState(TaskUrgency.Medium);

    useEffect(() => {
        async function loadGrows() {
            const result = await growService.getAll();
            setGrows(result);

            if (result.length > 0) setSelGrow(result[0]);
        }

        loadGrows();
    }, [growService]);

    async function handleCreate() {
        if (!selGrow || !title.trim()) return;

        await taskService.create({
            growId: selGrow.id,
            title: title.trim(),
            dueDate,
            urgency,
        });

        navigation.goBack();
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {selGrow ? (
                    <Select
                        label="Grow"
                        value={selGrow}
                        options={grows}
                        getLabel={(grow) => grow.name}
                        onChange={setSelGrow}
                    />
                ) : (
                    <Text>
                        Keine Grows vorhanden. Bitte zuerst einen Grow anlegen.
                    </Text>
                )}

                <Text style={styles.label}>Titel</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Titel der Aufgabe"
                    style={styles.input}
                />

                <View style={styles.dateRow}>
                    <Text style={styles.label}>Fälligkeitsdatum</Text>
                    <View style={styles.dateRowValue}>
                        <DateTimePicker
                            value={dueDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if(selectedDate)
                                    setDueDate(selectedDate);
                            }}
                        />
                        <Text>📆</Text>
                    </View>
                </View>

                <Select
                    label="Dringlichkeit"
                    value={urgency}
                    options={Object.values(TaskUrgency)}
                    getLabel={(value) => value}
                    onChange={setUrgency}
                />

                <Pressable
                    testID="create-task-button"
                    style={[
                        styles.button,
                        (!selGrow || !title.trim()) &&
                            styles.buttonDisabled,
                    ]}
                    onPress={handleCreate}
                    disabled={!selGrow || !title.trim()}
                >
                    <Text style={styles.buttonText}>Task erstellen</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.background,
    },
    label: {
        fontSize: Typography.body,
        fontWeight: "bold",
        marginBottom: Spacing.xs,
        color: Colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        fontSize: Typography.body,
        marginBottom: Spacing.md,
        color: Colors.text,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: Spacing.md,
    },
    dateRowValue: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    button: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: Radius.md,
        alignItems: "center",
        marginTop: Spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: Colors.surface,
        fontSize: Typography.body,
        fontWeight: "bold",
    },
});