import { z } from "zod";

export const UrlOrPathSchema = z.string().refine(
    (val) => val.startsWith("http") || val.startsWith("/"),
    { message: "Invalid URL or path" }
);