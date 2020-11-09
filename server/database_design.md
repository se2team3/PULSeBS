# Database design

![database design](http://www.plantuml.com/plantuml/png/VL9D3zem3BtdLrXSaD3u0mWnJhiCxROpCecXqV9HEGvielptDQMbfPkusK_sUyzvsIT1bkoTMa9b3O5K1AcEehfEMzQEbA8WLlx0ASPVDbpWhbQEj6IcepKR2DcVYE7RTxLAaWq5cS4tjDBkRGg18mmgrmQ5p15b0s8z9K5VAqEE_a4XClpuUJYenyj6JiJ5mqHakxrG82wakvtAmLw9KplR6RaYwmfPaKVhnhR6b6wH9mC1FOrTolmES7HZ1_T5V-pY2oo4K5V4fOpdizNFqcF0Iri-9kPrp9peetqTpKGdCfpjRpBWA411livyzjgpDnyL-wW-IfOun1RMeL9FepDMZj7FeAjboUZ6SFyRuyHFuVXePXO3eQHXij0CzpJDUjtSEpgbXg_vQC7kWyoWVkbjkSz2BQ5_mlvcQ5uaUmecU_SN)

To draw this diagram we used ![PlantUML](http://www.plantuml.com/plantuml/uml/VL9D3zem3BtdLrXSaD3u0mWnJhiCxROpCecXqV9HEGvielptDQMbfPkusK_sUyzvsIT1bkoTMa9b3O5K1AcEehfEMzQEbA8WLlx0ASPVDbpWhbQEj6IcepKR2DcVYE7RTxLAaWq5cS4tjDBkRGg18mmgrmQ5p15b0s8z9K5VAqEE_a4XClpuUJYenyj6JiJ5mqHakxrG82wakvtAmLw9KplR6RaYwmfPaKVhnhR6b6wH9mC1FOrTolmES7HZ1_T5V-pY2oo4K5V4fOpdizNFqcF0Iri-9kPrp9peetqTpKGdCfpjRpBWA411livyzjgpDnyL-wW-IfOun1RMeL9FepDMZj7FeAjboUZ6SFyRuyHFuVXePXO3eQHXij0CzpJDUjtSEpgbXg_vQC7kWyoWVkbjkSz2BQ5_mlvcQ5uaUmecU_SN) 

Here the corresponding "code":

```plantuml
@startuml
' hide the spot
hide circle

entity booking {
*lecture_id: number FK
*student_id: number FK
waiting: boolean
updated_at: timestamp
deleted_at: timestamp or NULL
}

entity user {
*id: number <<generated>>
university_id: varchar
email: varchar
password: varchar
name: varchar
surname: varchar
role: varchar {"student", "teacher", "officer", "manager"}
}

entity course {
*id: number <<generated>>
code: varchar or fixed len char?
name: varchar
teacher_id: number FK
}

entity lecture {
*id: number <<generated>>
datetime: datetime
course_id: number FK
room_id: number FK
virtual: boolean
deleted_at: timestamp
}

entity room {
*id: number <<generated>>
name: varchar
seats: number
}

lecture ||--|{ room

booking }|-- user

booking }|-- lecture
lecture ||-- course
' teacher
course ||-- user
@enduml
```
