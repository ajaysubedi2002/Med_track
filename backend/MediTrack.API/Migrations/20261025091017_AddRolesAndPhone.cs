using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRolesAndPhone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "users",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "users",
                type: "integer",
                nullable: false,
                defaultValue: 2);

            migrationBuilder.AddColumn<Guid>(
                name: "PrescribedByDoctorId",
                table: "medicines",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "doctor_patients",
                columns: table => new
                {
                    DoctorId = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctor_patients", x => new { x.DoctorId, x.PatientId });
                    table.ForeignKey(
                        name: "FK_doctor_patients_users_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_doctor_patients_users_PatientId",
                        column: x => x.PatientId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "Id", "CreatedAt", "Email", "Name", "PasswordHash", "Phone" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@meditrack.com", "Admin", "$2a$11$vpiJj31BpY7cC3iM0yi4leY33mxjnRSz.x52C3MHNY907xycyksEq", null });

            migrationBuilder.CreateIndex(
                name: "IX_medicines_PrescribedByDoctorId",
                table: "medicines",
                column: "PrescribedByDoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_patients_DoctorId",
                table: "doctor_patients",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_patients_PatientId",
                table: "doctor_patients",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_medicines_users_PrescribedByDoctorId",
                table: "medicines",
                column: "PrescribedByDoctorId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_medicines_users_PrescribedByDoctorId",
                table: "medicines");

            migrationBuilder.DropTable(
                name: "doctor_patients");

            migrationBuilder.DropIndex(
                name: "IX_medicines_PrescribedByDoctorId",
                table: "medicines");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "users");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "users");

            migrationBuilder.DropColumn(
                name: "PrescribedByDoctorId",
                table: "medicines");
        }
    }
}
