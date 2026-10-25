using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPrescribedByDoctorId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$qPPGjTByDjdl9j3JMlp/WexVANOZGJaEpvcQ0LTquvobscsr/VhnC");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "PasswordHash",
                value: "$2a$11$bOW39vP09Ffk6qLSks8CteMMfgOQGH7Ccmy6yAYfnk/GBeSppk8WK");
        }
    }
}
