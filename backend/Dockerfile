FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["CryptoAdvisor.Api/CryptoAdvisor.Api.csproj", "CryptoAdvisor.Api/"]
RUN dotnet restore "CryptoAdvisor.Api/CryptoAdvisor.Api.csproj"
COPY . .
WORKDIR "/src/CryptoAdvisor.Api"
RUN dotnet build "CryptoAdvisor.Api.csproj" -c Release -o /app/build
RUN dotnet publish "CryptoAdvisor.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CryptoAdvisor.Api.dll"]
