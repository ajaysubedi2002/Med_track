FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY MediTrack.API.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish --configuration Release --output /app/publish \
    --no-restore /p:UseAppHost=false

FROM build AS migrations
RUN dotnet tool install --global dotnet-ef --version 8.*
ENV PATH="${PATH}:/root/.dotnet/tools"

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080 \
    DOTNET_EnableDiagnostics=0
EXPOSE 8080

USER $APP_UID
ENTRYPOINT ["dotnet", "MediTrack.API.dll"]