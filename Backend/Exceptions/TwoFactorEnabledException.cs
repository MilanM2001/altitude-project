namespace Backend.Exceptions
{
    public class TwoFactorEnabledException : Exception
    {
        public TwoFactorEnabledException(string message) : base(message)
        {
        }
    }
}
