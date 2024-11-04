using System.Runtime.Serialization;

namespace Backend.Models.Enums
{
    public enum Role
    {
        [EnumMember(Value = "Admin")]
        Admin,

        [EnumMember(Value = "User")]
        User,
    }
}
