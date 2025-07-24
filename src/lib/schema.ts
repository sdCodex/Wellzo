import z from "zod";

export const doctorFormSchema = z.object({
  speciality: z.string().min(1, "Speciality is required"),
  experience: z
    .number({ error: (issue) => issue.input === undefined ? "Experience is required" : "Experience must be a number" })
    .int()
    .min(1, {error:"Experience must be at least 1 year"})
    .max(30, {error:"Experience must be less than 30 years"}),
  credentialUrl: z
    .url({error:"Please enter a valid URL"})
    .min(1, {error: "Credential URL is required"}),
  description: z
    .string()
    .min(20, {error: "Description must be at least 20 characters"})
    .max(1000,{error:"Description cannot exceed 1000 characters"}),
});


