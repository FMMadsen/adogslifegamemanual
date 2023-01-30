namespace WebApplicationProject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(new WebApplicationOptions(){
                Args = args,
                ApplicationName = typeof(Program).Assembly.FullName,
                ContentRootPath = Directory.GetCurrentDirectory(),
                EnvironmentName = Environments.Production,
                WebRootPath = ""
            });
            var app = builder.Build();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.Run();
        }
    }
}
