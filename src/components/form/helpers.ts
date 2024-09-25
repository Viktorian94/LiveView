import { UserSexEnum } from "@/components/form/types";

export const userDefaultValues = {
  name: '',
  policy: false,
  sex: UserSexEnum.None
}

export const countriesMock = [
  "USA",
  "Canada",
  "Ukraine",
  "Poland",
  "Germany",
]

export const sexValues = Object.values(UserSexEnum);