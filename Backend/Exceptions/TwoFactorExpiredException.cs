namespace Backend.Exceptions
{
    public class TwoFactorExpiredException : Exception
    {
        public TwoFactorExpiredException(string message) : base(message) 
        {

        }
    }
}
