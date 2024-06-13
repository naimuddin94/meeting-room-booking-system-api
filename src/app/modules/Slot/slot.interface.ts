import { z } from "zod";
import { SlotValidation } from "./slot.validation";

export interface ISlot extends z.infer<typeof SlotValidation.slotValidationSchema>{ }