package com.gdssoft.oa.model.archive;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.google.gson.annotations.Expose;

/**
 * Archives Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 */
public class ArchivesMonitor extends com.gdssoft.core.model.BaseModel {
	
	 @Expose
		protected Long archivesId;
	 @Expose
		protected Long runId;
	    @Expose
		protected String typeName;
	    @Expose
		protected String archivesNo;
	    @Expose
		protected String issueDep;
	    @Expose
		protected String subject;
	    @Expose
		protected java.util.Date issueDate;
	    @Expose
		protected String createtime;
	    @Expose
		protected Short status;
	    @Expose
		protected String shortContent;
	    @Expose
		protected Integer fileCounts;
	    @Expose
		protected String privacyLevel;
	    @Expose
		protected String urgentLevel;
	    @Expose
		protected String issuer;
	    @Expose
		protected Long issuerId;
	    @Expose
		protected String keywords;
	    @Expose
		protected String sources;
	    @Expose
		protected Short archType;
	    @Expose
	    protected String recDepIds;
	    @Expose
	    protected String recDepNames;
	    @Expose
	    protected String handlerUids;
	    @Expose
	    protected String handlerUnames;
	    @Expose
	    protected Long orgArchivesId;
	    @Expose
	    protected String depSignNo;
	    @Expose
	    protected com.gdssoft.oa.model.flow.ProcessRun processRun;
	    @Expose
	    protected Long parentArchId;
	    @Expose
	    protected Short isPublic;
	    @Expose
	   	protected String limitedDate;
	    @Expose
	   	protected java.util.Date writtenDate;
	    
	    @Expose
	    protected String archPrinter;

		@Expose
	    protected String archChecker;
		
		@Expose
	    protected String orgDepName;
	    
		@Expose
	    protected Long reviewUser;
		
		

		@Expose
	    protected String reviewUserName;
		


		@Expose
	    protected String sendTo;
		
		@Expose
	    protected String ccTo;
		
		@Expose
	    protected Short isStandard;
		
		@Expose
	    protected Integer isShared;
		
		@Expose
		protected String unPublicReasons;
		
		@Expose
		protected String orgDepId;
		
		@Expose
		protected java.util.Date signDate;
		
		@Expose
	    protected Long signUserId;
		@Expose
		protected Integer isReserveNo;//是否预约编号0否,1是
		@Expose
		protected Long snConfigId;
	    @Expose
		protected Long isreceive;
	    @Expose
		protected Long isdraft;
	    @Expose
		protected Long isComSetting;
		@Expose
		protected java.util.Date receiveDate;
		@Expose
		protected Long standardApprover;//确认规范性文件人id

		@Expose
		protected Date standardApproveDate;//确认规范性时间
		@Expose
		protected String enclosure;//附件文字
		@Expose
	    protected Integer transfered;//是否转移到oa_common
		
		protected Date electronicDocDate;//生成电子公文时间
		
		@Expose
		protected String activityname;//审查备案号
		@Expose
		protected String creatorname;//审查备案号
		@Expose
		protected String comments;//审查备案号
		@Expose
		protected String filepath;
		@Expose
		protected String filename;
		@Expose
		protected String docpath;
		@Expose
		protected String docname;
		
		
		public String getDocpath() {
			return docpath;
		}
		public void setDocpath(String docpath) {
			this.docpath = docpath;
		}
		public String getDocname() {
			return docname;
		}
		public void setDocname(String docname) {
			this.docname = docname;
		}
		public Long getRunId() {
			return runId;
		}
		public void setRunId(Long runId) {
			this.runId = runId;
		}
		public Long getArchivesId() {
			return archivesId;
		}
		public void setArchivesId(Long archivesId) {
			this.archivesId = archivesId;
		}
		public String getTypeName() {
			return typeName;
		}
		public void setTypeName(String typeName) {
			this.typeName = typeName;
		}
		public String getArchivesNo() {
			return archivesNo;
		}
		public void setArchivesNo(String archivesNo) {
			this.archivesNo = archivesNo;
		}
		public String getIssueDep() {
			return issueDep;
		}
		public void setIssueDep(String issueDep) {
			this.issueDep = issueDep;
		}
		public String getSubject() {
			return subject;
		}
		public void setSubject(String subject) {
			this.subject = subject;
		}
		public java.util.Date getIssueDate() {
			return issueDate;
		}
		public void setIssueDate(java.util.Date issueDate) {
			this.issueDate = issueDate;
		}

		public String getCreatetime() {
			return createtime;
		}
		public void setCreatetime(String createtime) {
			this.createtime = createtime;
		}
		public String getLimitedDate() {
			return limitedDate;
		}
		public void setLimitedDate(String limitedDate) {
			this.limitedDate = limitedDate;
		}
		public Short getStatus() {
			return status;
		}
		public void setStatus(Short status) {
			this.status = status;
		}
		public String getShortContent() {
			return shortContent;
		}
		public void setShortContent(String shortContent) {
			this.shortContent = shortContent;
		}
		public Integer getFileCounts() {
			return fileCounts;
		}
		public void setFileCounts(Integer fileCounts) {
			this.fileCounts = fileCounts;
		}
		public String getPrivacyLevel() {
			return privacyLevel;
		}
		public void setPrivacyLevel(String privacyLevel) {
			this.privacyLevel = privacyLevel;
		}
		public String getUrgentLevel() {
			return urgentLevel;
		}
		public void setUrgentLevel(String urgentLevel) {
			this.urgentLevel = urgentLevel;
		}
		public String getIssuer() {
			return issuer;
		}
		public void setIssuer(String issuer) {
			this.issuer = issuer;
		}
		public Long getIssuerId() {
			return issuerId;
		}
		public void setIssuerId(Long issuerId) {
			this.issuerId = issuerId;
		}
		public String getKeywords() {
			return keywords;
		}
		public void setKeywords(String keywords) {
			this.keywords = keywords;
		}
		public String getSources() {
			return sources;
		}
		public void setSources(String sources) {
			this.sources = sources;
		}
		public Short getArchType() {
			return archType;
		}
		public void setArchType(Short archType) {
			this.archType = archType;
		}
		public String getRecDepIds() {
			return recDepIds;
		}
		public void setRecDepIds(String recDepIds) {
			this.recDepIds = recDepIds;
		}
		public String getRecDepNames() {
			return recDepNames;
		}
		public void setRecDepNames(String recDepNames) {
			this.recDepNames = recDepNames;
		}
		public String getHandlerUids() {
			return handlerUids;
		}
		public void setHandlerUids(String handlerUids) {
			this.handlerUids = handlerUids;
		}
		public String getHandlerUnames() {
			return handlerUnames;
		}
		public void setHandlerUnames(String handlerUnames) {
			this.handlerUnames = handlerUnames;
		}
		public Long getOrgArchivesId() {
			return orgArchivesId;
		}
		public void setOrgArchivesId(Long orgArchivesId) {
			this.orgArchivesId = orgArchivesId;
		}
		public String getDepSignNo() {
			return depSignNo;
		}
		public void setDepSignNo(String depSignNo) {
			this.depSignNo = depSignNo;
		}
		public com.gdssoft.oa.model.flow.ProcessRun getProcessRun() {
			return processRun;
		}
		public void setProcessRun(com.gdssoft.oa.model.flow.ProcessRun processRun) {
			this.processRun = processRun;
		}
		public Long getParentArchId() {
			return parentArchId;
		}
		public void setParentArchId(Long parentArchId) {
			this.parentArchId = parentArchId;
		}
		public Short getIsPublic() {
			return isPublic;
		}
		public void setIsPublic(Short isPublic) {
			this.isPublic = isPublic;
		}
		public java.util.Date getWrittenDate() {
			return writtenDate;
		}
		public void setWrittenDate(java.util.Date writtenDate) {
			this.writtenDate = writtenDate;
		}
		public String getArchPrinter() {
			return archPrinter;
		}
		public void setArchPrinter(String archPrinter) {
			this.archPrinter = archPrinter;
		}
		public String getArchChecker() {
			return archChecker;
		}
		public void setArchChecker(String archChecker) {
			this.archChecker = archChecker;
		}
		public String getOrgDepName() {
			return orgDepName;
		}
		public void setOrgDepName(String orgDepName) {
			this.orgDepName = orgDepName;
		}
		public Long getReviewUser() {
			return reviewUser;
		}
		public void setReviewUser(Long reviewUser) {
			this.reviewUser = reviewUser;
		}
		public String getReviewUserName() {
			return reviewUserName;
		}
		public void setReviewUserName(String reviewUserName) {
			this.reviewUserName = reviewUserName;
		}
		public String getSendTo() {
			return sendTo;
		}
		public void setSendTo(String sendTo) {
			this.sendTo = sendTo;
		}
		public String getCcTo() {
			return ccTo;
		}
		public void setCcTo(String ccTo) {
			this.ccTo = ccTo;
		}
		public Short getIsStandard() {
			return isStandard;
		}
		public void setIsStandard(Short isStandard) {
			this.isStandard = isStandard;
		}
		public Integer getIsShared() {
			return isShared;
		}
		public void setIsShared(Integer isShared) {
			this.isShared = isShared;
		}
		public String getUnPublicReasons() {
			return unPublicReasons;
		}
		public void setUnPublicReasons(String unPublicReasons) {
			this.unPublicReasons = unPublicReasons;
		}
		public String getOrgDepId() {
			return orgDepId;
		}
		public void setOrgDepId(String orgDepId) {
			this.orgDepId = orgDepId;
		}
		public java.util.Date getSignDate() {
			return signDate;
		}
		public void setSignDate(java.util.Date signDate) {
			this.signDate = signDate;
		}
		public Long getSignUserId() {
			return signUserId;
		}
		public void setSignUserId(Long signUserId) {
			this.signUserId = signUserId;
		}
		public Integer getIsReserveNo() {
			return isReserveNo;
		}
		public void setIsReserveNo(Integer isReserveNo) {
			this.isReserveNo = isReserveNo;
		}
		public Long getSnConfigId() {
			return snConfigId;
		}
		public void setSnConfigId(Long snConfigId) {
			this.snConfigId = snConfigId;
		}
		public Long getIsreceive() {
			return isreceive;
		}
		public void setIsreceive(Long isreceive) {
			this.isreceive = isreceive;
		}
		public Long getIsdraft() {
			return isdraft;
		}
		public void setIsdraft(Long isdraft) {
			this.isdraft = isdraft;
		}
		public Long getIsComSetting() {
			return isComSetting;
		}
		public void setIsComSetting(Long isComSetting) {
			this.isComSetting = isComSetting;
		}
		public java.util.Date getReceiveDate() {
			return receiveDate;
		}
		public void setReceiveDate(java.util.Date receiveDate) {
			this.receiveDate = receiveDate;
		}
		public Long getStandardApprover() {
			return standardApprover;
		}
		public void setStandardApprover(Long standardApprover) {
			this.standardApprover = standardApprover;
		}
		public Date getStandardApproveDate() {
			return standardApproveDate;
		}
		public void setStandardApproveDate(Date standardApproveDate) {
			this.standardApproveDate = standardApproveDate;
		}
		public String getEnclosure() {
			return enclosure;
		}
		public void setEnclosure(String enclosure) {
			this.enclosure = enclosure;
		}
		public Integer getTransfered() {
			return transfered;
		}
		public void setTransfered(Integer transfered) {
			this.transfered = transfered;
		}
		public Date getElectronicDocDate() {
			return electronicDocDate;
		}
		public void setElectronicDocDate(Date electronicDocDate) {
			this.electronicDocDate = electronicDocDate;
		}
		public String getActivityname() {
			return activityname;
		}
		public void setActivityname(String activityname) {
			this.activityname = activityname;
		}
		public String getCreatorname() {
			return creatorname;
		}
		public void setCreatorname(String creatorname) {
			this.creatorname = creatorname;
		}
		public String getComments() {
			return comments;
		}
		public void setComments(String comments) {
			this.comments = comments;
		}
		public String getFilepath() {
			return filepath;
		}
		public void setFilepath(String filepath) {
			this.filepath = filepath;
		}
		public String getFilename() {
			return filename;
		}
		public void setFilename(String filename) {
			this.filename = filename;
		}

		
}
