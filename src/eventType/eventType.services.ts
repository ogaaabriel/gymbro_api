import db from "../utils/db";

export const findEventTypesByTitle = (title: string = "") => {
    return db.eventType.findMany({ where: { title: { contains: title, mode: "insensitive" } } })
}

export const findEventTypeById = (id: number) => {
    return db.eventType.findFirst({
        where: { id },
    });
}