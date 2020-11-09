# Database design

![database design](http://www.plantuml.com/plantuml/png/ZLDDZo8X4BtNho1UJCpw1unnFUrbpTxst44eRJ9yT0hGcQZ_VK1nw45ZvjHLZ-Az1uzU-y0fHADXodebaOKUcHzSW6id50cD06Y32XziwzoRidjsWfb64I9Xf-I2sMYsIEpFNvZv46KQRk0ZLo7jMsG2ZTp2GEZJM0NY87b0sV641MKmsJ83IDJuW397xD__pGOkNxwYHygcHghBvHujKYPThI1QTK3oQRRBCmTEekS4QBZIjHsuzqT7em7B3TREH_eEaDErOwT9EVta5vi4vA97ogNRxPIubOPRla_bPMHUk4WUNzeNJevq7B6TUaV9D5gMaT-DpwBTX50LItOl9MNw1fLPxnNSZ3Qiv9nfe8EY4BckuJwDSUGdSxmqqyI0FFZxvCD5TYM4J5YGdxpHpDCGNCxp-VLfFLsuOG3topmdy7owdWMW_2YLee7Afj7coZXb9RyYcnSBoHgjZ4P_0W00)

To draw this diagram we used ![PlantUML](http://www.plantuml.com/plantuml/uml/ZLDDZo8X4BtNho1UJCpw1unnFUrbpTxst44eRJ9yT0hGcQZ_VK1nw45ZvjHLZ-Az1uzU-y0fHADXodebaOKUcHzSW6id50cD06Y32XziwzoRidjsWfb64I9Xf-I2sMYsIEpFNvZv46KQRk0ZLo7jMsG2ZTp2GEZJM0NY87b0sV641MKmsJ83IDJuW397xD__pGOkNxwYHygcHghBvHujKYPThI1QTK3oQRRBCmTEekS4QBZIjHsuzqT7em7B3TREH_eEaDErOwT9EVta5vi4vA97ogNRxPIubOPRla_bPMHUk4WUNzeNJevq7B6TUaV9D5gMaT-DpwBTX50LItOl9MNw1fLPxnNSZ3Qiv9nfe8EY4BckuJwDSUGdSxmqqyI0FFZxvCD5TYM4J5YGdxpHpDCGNCxp-VLfFLsuOG3topmdy7owdWMW_2YLee7Afj7coZXb9RyYcnSBoHgjZ4P_0W00) 

Here the corresponding "code":

```plantuml
@startuml
' hide the spot
hide circle

entity booking {
*lecture_id: number FK
*student_id: number FK
waiting: boolean
present: boolean
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

entity course_student {
*course_id: number FK
*student_id: number FK
}

course_student }|-- user
course_student }|-- course

lecture ||--|{ room

booking }|-- user

booking }|-- lecture
lecture ||-- course
' teacher
course ||-- user
@enduml
```
