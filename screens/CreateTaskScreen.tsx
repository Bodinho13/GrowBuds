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
import { Section } from "../components/common";

type Props = NativeStackScreenProps<TaskStackParamList, "CreateTask">;

export default function CreateTaskScreen({ navigation }: Props) {
    const { growService, taskService } = useServices();

    const [grows, setGrows] = useState<Grow[]>([]);
    const [selGrow, setSelGrow] = useState<Grow | undefined>();
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState(new Date());
    const [urgency, setUrgency] = useState(TaskUrgency.Medium);
    const [recurrenceEnabled, setRecurrenceEnabled] = useState(false);
    const [recurrenceInterval, setRecurrenceInterval] = useState("1");
    const [recurrenceUnit, setRecurrenceUnit] = useState<"day" | "week">("day");
    const [leadTimeDays, setLeadTimeDays] = useState("0");

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

        if(recurrenceEnabled) {
            const interval = Number(recurrenceInterval);

            if(!Number.isInteger(interval) || interval < 0)
                return;
        } else {
            const leadTime = Number(leadTimeDays);

            if(!Number.isInteger(leadTime) || leadTime < 0)
                return;
        }

        await taskService.create({
            growId: selGrow.id,
            title: title.trim(),
            dueDate,
            urgency,
            recurrence: recurrenceEnabled
                ? {
                    interval: Number(recurrenceInterval),
                    unit: recurrenceUnit
                } : undefined,
            leadTimeDays: recurrenceEnabled
                ? undefined : Number(leadTimeDays),
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

                <Section title="Wiederholung">
                    <View style={styles.checkboxRow}>
                        <Text style={styles.checkboxLabel}>Aufgabe Wiederholen ?  </Text>
                        <Pressable
                            style={[
                                styles.checkbox,
                                recurrenceEnabled && styles.checkboxChecked,
                            ]}
                            onPress={() => setRecurrenceEnabled((current) => !current)}
                        >
                            {recurrenceEnabled && (
                                <Text style={styles.checkboxCheck}>✓</Text>
                            )}
                        </Pressable>
                    </View>
                    {recurrenceEnabled && (
                        <View style={styles.recurrenceContainer}>
                            <Text style={styles.label}>Alle</Text>
                            <TextInput
                                value={recurrenceInterval}
                                onChangeText={setRecurrenceInterval}
                                keyboardType="numeric"
                                style={styles.intervalInput}
                            />
                            <Select
                                label="Einheit"
                                value={recurrenceUnit}
                                options={["day", "week"]}
                                getLabel={(value) => value === "day" ? "Tag(e)" : "Woche(n)"}
                                onChange={setRecurrenceUnit}
                            />
                        </View>
                    )}
                    {!recurrenceEnabled && (
                        <View style={styles.leadTimeContainer}>
                            <Text style={styles.label}>Vorher öffnen</Text>
                            <View style={styles.leadTimeRow}>
                                <TextInput
                                    value={leadTimeDays}
                                    onChangeText={setLeadTimeDays}
                                    keyboardType="numeric"
                                    style={styles.leadTimeInput}
                                />
                                <Text style={styles.leadTimeUnit}>Tage vorher</Text>
                            </View>
                        </View>
                    )}
                </Section>

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
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: Spacing.md,
        marginBottom: Spacing.md,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.sm,
        backgroundColor: Colors.surface,
        alignItems: "center",
        justifyContent: "center",
        marginRight: Spacing.sm,
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    checkboxCheck: {
        color: Colors.background,
        fontSize: Typography.body,
        fontWeight: "bold",
    },
    checkboxLabel: {
        color: Colors.text,
        fontSize: Typography.body,
    },
    recurrenceContainer: {
        marginTop: Spacing.sm,
    },
    intervalInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        fontSize: Typography.body,
        marginBottom: Spacing.md,
        color: Colors.text,
    },
    leadTimeContainer: {
        marginBottom: Spacing.md,
    },
    leadTimeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
    },
    leadTimeInput: {
        width: 70,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        padding: Spacing.sm,
        fontSize: Typography.body,
        color: Colors.text,
        textAlign: "center",
    },
    leadTimeUnit: {
        fontSize: Typography.body,
        color: Colors.textSecondary,
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