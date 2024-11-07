namespace Backend.Exceptions
{
    public class UserDeletedException : Exception
    {
        public UserDeletedException(string message) : base(message)
        {
        }
    }
}
