namespace Backend.Exceptions
{
    public class InvalidCodeException : Exception
    {
        public InvalidCodeException(string message) : base(message)
        {
        }
    }
}
