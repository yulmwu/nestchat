export const selectUserBriefColumns = (userColumn: string) => [
    `${userColumn}.id`,
    `${userColumn}.username`,
    `${userColumn}.nickname`,
    `${userColumn}.description`,
    `${userColumn}.profileImage`,
    `${userColumn}.role`,
    `${userColumn}.points`,
    `${userColumn}.followersCount`,
    `${userColumn}.followingCount`,
]
