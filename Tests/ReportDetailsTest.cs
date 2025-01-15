using Application.Contracts.Repositories;
using Application.Contracts.Services;
using Application.Models.DTOs.Common;
using Application.Models.DTOs.Report;
using Application.Models.Helpers;
using Application.Services;
using AutoMapper;
using Infrastructure.Entities;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests
{
    public class ReportDetailsTest
    {
        private Mock<IReportDetailsRepository> _repo;
        private Mock<IUserClaimsService> _userClaims;
        private readonly IMapper _mapper;

        public ReportDetailsTest()
        {
            _repo = new Mock<IReportDetailsRepository>();
            _userClaims = new Mock<IUserClaimsService>();

            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Report, ReportDTO>();
            });

            _mapper = configuration.CreateMapper();
        }

        public ReportDetailsService Subject()
        {
            var mockUserClaims = new UserClaimsDTO
            {
                EmployeeID = "E12345",
                RoleID = 1,
                RoleName = "BOCCH",
                Name = "John Doe",
                LoginName = "jdoe",
                LoginDateTime = "2025-01-06 09:30:00"
            };
            _userClaims.Setup(service => service.GetClaims()).Returns(mockUserClaims);
            return new ReportDetailsService(_repo.Object, _userClaims.Object, _mapper);
        }

        [Fact]
        public async Task GetReport_ShouldReturnMappedReportDTO_WhenReportExists()
        {
            // Arrange
            var report = new Report
            {
                ToRecipients = "recipient1@example.com;recipient2@example.com",
                Ccrecipients = "cc1@example.com;cc2@example.com"
            };
            _repo.Setup(r => r.GetReports(It.IsAny<int>())).ReturnsAsync(report);

            var service = Subject();

            // Act
            var result = await service.GetReport(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.ToList.Count);
            Assert.Equal(2, result.CCList.Count);
        }
        [Fact]
        public async Task SelectedBranches_ShouldReturnBranchList_WhenReportHasSelectedBranches()
        {
            // Arrange
            var report = new Report
            {
                SelectedBranches = "001-002-003"
            };
            var branchNames = new[] { "Branch1", "Branch2", "Branch3" };
            _repo.Setup(r => r.GetReports(It.IsAny<int>())).ReturnsAsync(report);
            _repo.Setup(r => r.GetBranchNames(It.IsAny<List<string>>())).ReturnsAsync(branchNames);

            var service = Subject();

            // Act
            var result = await service.SelectedBranches(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Contains("Branch1", result);
        }
        [Fact]
        public async Task GetBranchNames_ShouldReturnBranchNames_WhenBranchCodesAreProvided()
        {
            // Arrange
            var report = new Report
            {
                SelectedBranches = "001-002-003"
            };
            var branchNames = new[] { "Branch1", "Branch2", "Branch3" };
            _repo.Setup(r => r.GetBranchNames(It.IsAny<List<string>>())).ReturnsAsync(branchNames);

            var service = Subject();

            // Act
            var result = await service.GetBranchNames(report);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Length);
            Assert.Contains("Branch1", result);
        }
        [Fact]
        public async Task PopulateBranchRecipients_ShouldReturnDropdownList()
        {
            // Arrange
            string brCode = "001-002-003";
            string selected = "12345";
            var branchAccesses = new List<string> { "BR001", "BR002", "BR003" };
            var usersList = new List<User>
            {
                new User { EmployeeId = "12345", FirstName = "John", MiddleName = null, LastName = "Doe", Email = "john.doe@example.com" },
                new User { EmployeeId = "67890", FirstName = "Jane", MiddleName = "M", LastName = "Smith", Email = "jane.smith@example.com" }
            };

            _repo.Setup(r => r.GetBranchAccesses(It.IsAny<int[]>())).ReturnsAsync(branchAccesses);
            _repo.Setup(r => r.GetUsersByBranch(branchAccesses)).ReturnsAsync(usersList);

            var service = Subject();

            // Act
            var result = await service.PopulateBranchRecipients(selected, brCode);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.True(result.First().IsSelected);
            Assert.Equal("12345", result.First().Text);
            Assert.Contains("JOHN  DOE <john.doe@example.com>", result.First().Value);
        }
        [Fact]
        public async Task PopulateBranchRecipients_ShouldThrowException_WhenRepositoryFails()
        {
            // Arrange
            string brCode = "001-002-003";
            _repo.Setup(r => r.GetBranchAccesses(It.IsAny<int[]>())).ThrowsAsync(new Exception("Database error"));

            var service = Subject();

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => service.PopulateBranchRecipients("", brCode));
        }
        [Fact]
        public async Task PulloutRequest_ShouldReturnSuccessResponse_WhenReportExists()
        {
            // Arrange
            int reportId = 1;
            string refno = "REF12345";
            string userName = "jdoe";
            var report = new Report();
            var reportRevs = new ReportsRev();
            var rContents = new List<ReportContent>();
            var epPlusReturn = new EPPlusReturn();

            _userClaims.Setup(u => u.GetClaims()).Returns(new UserClaimsDTO { LoginName = userName });
            _repo.Setup(r => r.GetReports(reportId)).ReturnsAsync(report);
            _repo.Setup(r => r.GetReportsRevsLast(report)).ReturnsAsync(reportRevs);
            _repo.Setup(r => r.GetReportContentsList(reportId, refno)).ReturnsAsync(rContents);
            _repo.Setup(r => r.GeneratePulloutRequest(userName, rContents, report, reportRevs, It.IsAny<List<string>>())).ReturnsAsync(epPlusReturn);

            var service = Subject();

            // Act
            var result = await service.PulloutRequest(reportId, refno);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Success);
            Assert.Equal(epPlusReturn, result.Data);
        }
        [Fact]
        public async Task PulloutRequest_ShouldReturnErrorResponse_WhenReportIsNull()
        {
            // Arrange
            int reportId = 1;
            string refno = "REF12345";

            _repo.Setup(r => r.GetReports(reportId)).ReturnsAsync((Report)null);

            var service = Subject();

            // Act
            var result = await service.PulloutRequest(reportId, refno);

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
        }
        [Fact]
        public async Task ExportDataFromDetails_ShouldReturnSuccessResponse_WhenReportHasContents()
        {
            // Arrange
            int reportId = 1;
            string userName = "jdoe";
            var report = new Report { ReportCategory = (int)ReportCategory.RedFlag };
            var reportRevs = new ReportsRev { CreatedBy = "maker", ApprovedBy = "approver" };
            var rContents = new List<ReportContent>
            {
                new ReportContent { Id = new Guid(), ExceptionNo = "EX001" }
            };
            var branchReplies = new List<BranchReply>
            {
                new BranchReply { ActionPlan = "Plan1" },
                new BranchReply { ActionPlan = "Plan2" }
            };
            var epPlusReturn = new EPPlusReturn();

            _userClaims.Setup(u => u.GetClaims()).Returns(new UserClaimsDTO { LoginName = userName });
            _repo.Setup(r => r.GetReports(reportId)).ReturnsAsync(report);
            _repo.Setup(r => r.GetReportsRevsLast(report)).ReturnsAsync(reportRevs);
            _repo.Setup(r => r.GetMaker("maker")).ReturnsAsync(new User { FirstName = "Maker", LastName = "User", Role = new Role { Description = "Maker Role" } });
            _repo.Setup(r => r.GetApprover("approver")).ReturnsAsync(new User { FirstName = "Approver", LastName = "User", Role = new Role { Description = "Approver Role" } });
            _repo.Setup(r => r.GetReportContentsList(reportId)).ReturnsAsync(rContents);
            _repo.Setup(r => r.GetBranchReplyList(It.IsAny<string>(), It.IsAny<Guid>())).ReturnsAsync(branchReplies);
            _repo.Setup(r => r.GetRiskAssesmentAsync(rContents)).ReturnsAsync(rContents);
            _repo.Setup(r => r.GetApprovBy(reportId)).ReturnsAsync("Approver");
            _repo.Setup(r => r.ExportDataFromDetailsRedFlag(rContents, report, It.IsAny<List<string>>(), "Approver", userName)).Returns(epPlusReturn);

            var service = Subject();

            // Act
            var result = await service.ExportDataFromDetails(reportId);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Success);
            Assert.Equal(epPlusReturn, result.Data);
        }
        [Fact]
        public async Task ExportDataFromDetails_ShouldReturnErrorResponse_WhenReportContentIsEmpty()
        {
            // Arrange
            int reportId = 1;
            var report = new Report { ReportCategory = (int)ReportCategory.RedFlag };
            var reportRevs = new ReportsRev();

            _repo.Setup(r => r.GetReports(reportId)).ReturnsAsync(report);
            _repo.Setup(r => r.GetReportsRevsLast(report)).ReturnsAsync(reportRevs);
            _repo.Setup(r => r.GetReportContentsList(reportId)).ReturnsAsync(new List<ReportContent>());

            var service = Subject();

            // Act
            var result = await service.ExportDataFromDetails(reportId);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("No generated report.", result.Message);
        }
        [Fact]
        public async Task ExportDataFromDetails_ShouldThrowException_WhenRepositoryFails()
        {
            // Arrange
            int reportId = 1;
            _repo.Setup(r => r.GetReports(reportId)).ThrowsAsync(new Exception("Repository error"));

            var service = Subject();

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => service.ExportDataFromDetails(reportId));
        }
        [Fact]
        public async Task Approve_ShouldUpdateStatus_WhenSuccessful()
        {
            // Arrange
            var service = Subject();
            var reportsGuid = Guid.NewGuid();

            var report = new Report
            {
                Id = 1,
                Status = (int)ReportStatus.Standby,
                CreatedBy = "jdoe", // Add CreatedBy here
                SelectedBranches = "Branch1",
                ReportCategory = 1,
                ToRecipients = "user1@example.com;user2@example.com",
                Ccrecipients = "cc1@example.com;cc2@example.com"
            };

            var reportRevs = new ReportsRev { ModifiedBy = "otheruser" };
            var mockUser = new User
            {
                LoginName = "jdoe",
                EmployeeId = "E12345",
                FirstName = "John",
                LastName = "Doe",
                Email = "jdoe@example.com",
                Status = 1,
                IsLoggedIn = 1,
                LogInCounter = 5,
                IsLocked = false,
                CreatedDate = DateTime.Now,
                RoleId = 1
            };

            _repo.Setup(r => r.GetUserEmployeeID("jdoe")).ReturnsAsync(mockUser);
            _repo.Setup(r => r.GetReports(1)).ReturnsAsync(report);
            _repo.Setup(r => r.GetReportsRevs(reportsGuid)).ReturnsAsync(reportRevs);
            _repo.Setup(r => r.UpdateReportAndRev(report, reportRevs)).Returns(Task.CompletedTask);

            // Act
            var result = await service.Approve(1, reportsGuid);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Successfully Approved", result.Message);

            // Verify that the repository methods were called
            _repo.Verify(r => r.GetReports(1), Times.Once);
            _repo.Verify(r => r.GetReportsRevs(reportsGuid), Times.Once);
            _repo.Verify(r => r.UpdateReportAndRev(It.IsAny<Report>(), It.IsAny<ReportsRev>()), Times.Once);
        }

        [Fact]
        public async Task Approve_ShouldReturnError_WhenRequestorTriesToApprove()
        {
            // Arrange
            var service = Subject();
            var reportsGuid = Guid.NewGuid();

            _repo.Setup(r => r.GetReportsRevs(reportsGuid)).ReturnsAsync(new ReportsRev
            {
                ModifiedBy = "jdoe" // Same as logged-in user
            });

            // Act
            var result = await service.Approve(1, reportsGuid);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("You cannot approve/reject your own request. Ask for other AOO/BCO's approval", result.Message);
        }
        [Fact]
        public async Task SendReport_ShouldReturnError_WhenRecipientsAreEmpty()
        {
            // Arrange
            var service = Subject();

            // Act
            var result = await service.SendReport(null, null, 1);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Please select atleast 1 recipient", result.Message);
        }
        [Fact]
        public async Task SendReport_ShouldReturnSuccess_WhenRequestIsPendingApproval()
        {
            // Arrange
            var service = Subject();
            var report = new Report { Id = 1, Status = (int)ReportStatus.Standby };

            _repo.Setup(r => r.GetReports(1)).ReturnsAsync(report);
            _repo.Setup(r => r.GetRecipients(It.IsAny<Report>())).ReturnsAsync(new List<string> { "test@example.com" });

            // Act
            var result = await service.SendReport(new List<string> { "recipient1" }, null, 1);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Sending request is now Pending for Approval", result.Message);
        }
        [Fact]
        public async Task Reject_ShouldReturnError_WhenRepositoryThrowsException()
        {
            // Arrange
            var service = Subject();
            var reportsGuid = Guid.NewGuid();

            _repo.Setup(r => r.GetReportsRevs(reportsGuid)).ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await service.Reject(1, reportsGuid, "Invalid data");

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Database error", result.Message);
        }
        [Fact]
        public async Task Reject_ShouldReturnError_WhenRemarksAreEmpty()
        {
            // Arrange
            var service = Subject();

            // Act
            var result = await service.Reject(1, Guid.NewGuid(), "");

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Remarks field cannot be empty. Please try again", result.Message);
        }
        [Fact]
        public async Task Reject_ShouldReturnError_WhenRequestorTriesToReject()
        {
            // Arrange
            var service = Subject();
            var reportsGuid = Guid.NewGuid();

            _repo.Setup(r => r.GetReportsRevs(reportsGuid)).ReturnsAsync(new ReportsRev
            {
                ModifiedBy = "jdoe" // Same as logged-in user
            });

            // Act
            var result = await service.Reject(1, reportsGuid, "Invalid data");

            // Assert
            Assert.False(result.Success);
            Assert.Equal("You cannot approve/reject your own request. Ask for other AOO/BCO's approval", result.Message);
        }
    }

}
