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
public class Archives extends com.gdssoft.core.model.BaseModel {
	/**
	 * 公文状态--草稿
	 */
	public static final Short STATUS_DRAFT=0;
	/**
	 * 公文状态--发文
	 */
	public static final Short STATUS_ISSUE=1;
	/**
	 * 公文状态--归档
	 */
	public static final Short STATUS_ARCHIVE=2;
	/**
	 * 公文状态--等待主任审批
	 */
	public static final Short STATUS_SUBMITCHECK=1;
	/**
	 * 公文状态--等待领导审批
	 */
	public static final Short STATUS_LEADERCHECK=2;
	/**
	 * 公文状态--等待分发
	 */
//	public static final Short STATUS_DISPATCH=3;
	/**
	 * 公文状态-等待处理
	 */
//	public static final Short STATUS_HANDLE=4;
	/**
	 * 公文状态-处理中
	 */
	public static final Short STATUS_HANDLING=5;
	/**
	 * 公文状态--等待申请归档
	 */
	public static final Short STATUS_APPLYBACK=6;
	/**
	 * 公文状态--等待归档
	 */
	public static final Short STATUS_BACK=7;
	/**
	 * 公文状态--收文归档
	 */
//	public static final Short STATUS_END=8;
	
//	public static final Short STATUS_ARCHIVE=2;
	/**
	 * 公文状态--提交拟办
	 */
	public static final Short STATUS_HANDLE=1;
	/**
	 * 公文状态--拟办中
	 */
	public static final Short STATUS_HANDLEING=2;
	/**
	 * 公文状态--等待领导批示
	 */
	public static final Short STATUS_LEADERREAD=3;
	/**
	 * 公文状态--提交分发
	 */
	public static final Short STATUS_DISPATCH=4;
	/**
	 * 公文状态--阅读处理
	 */
	public static final Short STATUS_READ=5;
	/**
	 * 公文状态--阅读处理中
	 */
	public static final Short STATUS_READING=6;
	/**
	 * 公文状态--收文归档
	 */
	public static final Short STATUS_END=7;
	/**
	 * 发文
	 */
	public static final Short ARCHIVE_TYPE_DISPATCH=0;
	
	/**
	 * 收文
	 */
	public static final Short ARCHIVE_TYPE_RECEIVE=1;
		
    @Expose
	protected Long archivesId;
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
	protected java.util.Date createtime;
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
	protected Short archType;//0=发文   1=收文   2=督办件 3=报文  4=舆情 5=会议通知 6=工作通知 7=主任办公会
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
   	protected java.util.Date limitedDate;
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
	protected String examineRecordNumber;//审查备案号
	
	public Date getElectronicDocDate() {
		return electronicDocDate;
	}

	public void setElectronicDocDate(Date electronicDocDate) {
		this.electronicDocDate = electronicDocDate;
	}

	/**
	 * @return the transfered
	 */
	public Integer getTransfered() {
		return transfered;
	}

	/**
	 * @param transfered the transfered to set
	 */
	public void setTransfered(Integer transfered) {
		this.transfered = transfered;
	}

	public String getEnclosure() {
		return enclosure;
	}

	public void setEnclosure(String enclosure) {
		this.enclosure = enclosure;
	}

	public Long getIsComSetting() {
		return isComSetting;
	}

	public void setIsComSetting(Long isComSetting) {
		this.isComSetting = isComSetting;
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

	public Integer getIsReserveNo() {
		return isReserveNo;
	}

	public void setIsReserveNo(Integer isReserveNo) {
		this.isReserveNo = isReserveNo;
	}

	public Short getIsPublic() {
		return isPublic;
	}

	public void setIsPublic(Short isPublic) {
		this.isPublic = isPublic;
	}

	/**
	 * 普通公文类型ID
	 */
    @Expose
	protected com.gdssoft.oa.model.archive.OdFlowtype odFlowtype;
    
    @Expose
	protected ArchivesType archivesType;
    
    public ArchivesType getArchivesType() {
		return archivesType;
	}

	public void setArchivesType(ArchivesType archivesType) {
		this.archivesType = archivesType;
	}

	@Expose
	protected com.gdssoft.oa.model.system.Department department;
    @Expose
    protected java.util.Set archivesHandles = new java.util.HashSet();
    @Expose
	protected java.util.Set archivesDeps = new java.util.HashSet();
    @Expose
	protected Set archivesDocs=new HashSet();
    
    /**
	 * 公文类型-0 代表正式公文 1 代表普通公文
	 */
    protected short isArchive;

	protected Set leaders=new HashSet();
	protected Set archivesDispatch=new HashSet();
	protected Set archivesAttends=new HashSet();
	
	protected java.util.Set<AppUser> archivesCCs = new java.util.HashSet<AppUser>();
	
	/**
	 *@author F3222500
	 *@date 2013.11.25
	 *@description 公文附件
	 */
	@Expose
    protected java.util.Set archivesFiles = new java.util.HashSet();
	
	public java.util.Set getArchivesFiles() {
		return archivesFiles;
	}

	public void setArchivesFiles(java.util.Set archivesFiles) {
		this.archivesFiles = archivesFiles;
	}

	public java.util.Set<AppUser> getArchivesCCs() {
		return archivesCCs;
	}

	public void setArchivesCCs(java.util.Set<AppUser> archivesCCs) {
		this.archivesCCs = archivesCCs;
	}

	public Set getArchivesAttends() {
		return archivesAttends;
	}

	public void setArchivesAttends(Set archivesAttends) {
		this.archivesAttends = archivesAttends;
	}

	public Set getArchivesDispatch() {
		return archivesDispatch;
	}

	public void setArchivesDispatch(Set archivesDispatch) {
		this.archivesDispatch = archivesDispatch;
	}

	public Set getLeaders() {
		return leaders;
	}

	public void setLeaders(Set leaders) {
		this.leaders = leaders;
	}
	
	public ProcessRun getProcessRun() {
		return processRun;
	}

	public void setProcessRun(ProcessRun processRun) {
		this.processRun = processRun;
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

	/**
	 * Default Empty Constructor for class Archives
	 */
	public Archives () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class Archives
	 */
	public Archives (
		 Long in_archivesId
        ) {
		this.setArchivesId(in_archivesId);
    }

	public java.util.Set getArchivesHandles() {
		return archivesHandles;
	}

	public void setArchivesHandles(java.util.Set archivesHandles) {
		this.archivesHandles = archivesHandles;
	}
	
	
	public com.gdssoft.oa.model.archive.OdFlowtype getOdFlowtype() {
		return odFlowtype;
	}

	public void setOdFlowtype(com.gdssoft.oa.model.archive.OdFlowtype odFlowtype) {
		this.odFlowtype = odFlowtype;
	}

	public com.gdssoft.oa.model.system.Department getDepartment () {
		return department;
	}	
	
	public void setDepartment (com.gdssoft.oa.model.system.Department in_department) {
		this.department = in_department;
	}

	public java.util.Set getArchivesDeps () {
		return archivesDeps;
	}	
	
	public void setArchivesDeps (java.util.Set in_archivesDeps) {
		this.archivesDeps = in_archivesDeps;
	}

	/**
	 * 	 * @return Long
     * @hibernate.id column="archivesId" type="java.lang.Long" generator-class="native"
	 */
	public Long getArchivesId() {
		return this.archivesId;
	}
	
	/**
	 * Set the archivesId
	 */	
	public void setArchivesId(Long aValue) {
		this.archivesId = aValue;
	}	

	/**
	 * 公文类型	 * @return Long
	 */
	public Long getTypeId() {
		return this.getOdFlowtype()==null?null:this.getOdFlowtype().getId();
	}
	
	/**
	 * Set the typeId
	 */	
	public void setTypeId(Long aValue) {
	    if (aValue==null) {
	    	odFlowtype = null;
	    } else if (odFlowtype == null) {
	    	odFlowtype = new com.gdssoft.oa.model.archive.OdFlowtype(aValue);
	    	odFlowtype.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
	    	odFlowtype.setId(aValue);
	    }
	}	

	
	/**
	 * 公文类型名称	 * @return String
	 * @hibernate.property column="typeName" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getTypeName() {
		return this.typeName;
	}
	
	/**
	 * Set the typeName
	 * @spring.validator type="required"
	 */	
	public void setTypeName(String aValue) {
		this.typeName = aValue;
	}	

	/**
	 * 发文字号	 * @return String
	 * @hibernate.property column="archivesNo" type="java.lang.String" length="100" not-null="true" unique="false"
	 */
	public String getArchivesNo() {
		return this.archivesNo;
	}
	
	/**
	 * Set the archivesNo
	 * @spring.validator type="required"
	 */	
	public void setArchivesNo(String aValue) {
		this.archivesNo = aValue;
	}	

	/**
	 * 发文机关或部门	 * @return String
	 * @hibernate.property column="issueDep" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getIssueDep() {
		return this.issueDep;
	}
	
	/**
	 * Set the issueDep
	 * @spring.validator type="required"
	 */	
	public void setIssueDep(String aValue) {
		this.issueDep = aValue;
	}	

	
	/**
	 * 发文部门ID	 * @return Long
	 */
	public Long getDepId() {
		return this.getDepartment()==null?null:this.getDepartment().getDepId();
	}
	
	/**
	 * Set the depId
	 */	
	public void setDepId(Long aValue) {
	    if (aValue==null) {
	    	department = null;
	    } else if (department == null) {
	        department = new com.gdssoft.oa.model.system.Department(aValue);
	        department.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			department.setDepId(aValue);
	    }
	}	

	/**
	 * 文件标题	 * @return String
	 * @hibernate.property column="subject" type="java.lang.String" length="256" not-null="true" unique="false"
	 */
	public String getSubject() {
		return this.subject;
	}
	
	/**
	 * Set the subject
	 * @spring.validator type="required"
	 */	
	public void setSubject(String aValue) {
		this.subject = aValue;
	}	

	/**
	 * 发布日期	 * @return java.util.Date
	 * @hibernate.property column="issueDate" type="java.util.Date" length="19" not-null="true" unique="false"
	 */
	public java.util.Date getIssueDate() {
		return this.issueDate;
	}
	
	/**
	 * Set the issueDate
	 * @spring.validator type="required"
	 */	
	public void setIssueDate(java.util.Date aValue) {
		this.issueDate = aValue;
	}	

	/**
	 * 公文状态
            0=拟稿、修改状态
            1=发文状态
            2=归档状态	 * @return Short
	 * @hibernate.property column="status" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getStatus() {
		return this.status;
	}
	
	/**
	 * Set the status
	 * @spring.validator type="required"
	 */	
	public void setStatus(Short aValue) {
		this.status = aValue;
	}	

	/**
	 * 内容简介	 * @return String
	 * @hibernate.property column="shortContent" type="java.lang.String" length="1024" not-null="false" unique="false"
	 */
	public String getShortContent() {
		return this.shortContent;
	}
	
	/**
	 * Set the shortContent
	 */	
	public void setShortContent(String aValue) {
		this.shortContent = aValue;
	}	

	/**
	 * 文件数	 * @return Integer
	 * @hibernate.property column="fileCounts" type="java.lang.Integer" length="10" not-null="true" unique="false"
	 */
	public Integer getFileCounts() {
		return this.fileCounts;
	}
	
	/**
	 * Set the fileCounts
	 * @spring.validator type="required"
	 */	
	public void setFileCounts(Integer aValue) {
		this.fileCounts = aValue;
	}	

	/**
	 * 秘密等级
            普通
            秘密
            机密
            绝密	 * @return String
	 * @hibernate.property column="privacyLevel" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getPrivacyLevel() {
		return this.privacyLevel;
	}
	
	/**
	 * Set the privacyLevel
	 */	
	public void setPrivacyLevel(String aValue) {
		this.privacyLevel = aValue;
	}	

	/**
	 * 紧急程度
            普通
            紧急
            特急
            特提	 * @return String
	 * @hibernate.property column="urgentLevel" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getUrgentLevel() {
		return this.urgentLevel;
	}
	
	/**
	 * Set the urgentLevel
	 */	
	public void setUrgentLevel(String aValue) {
		this.urgentLevel = aValue;
	}	

	/**
	 * 发文人	 * @return String
	 * @hibernate.property column="issuer" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getIssuer() {
		return this.issuer;
	}
	
	/**
	 * Set the issuer
	 */	
	public void setIssuer(String aValue) {
		this.issuer = aValue;
	}	

	/**
	 * 发文人ID	 * @return Long
	 * @hibernate.property column="issuerId" type="java.lang.Long" length="19" not-null="false" unique="false"
	 */
	public Long getIssuerId() {
		return this.issuerId;
	}
	
	/**
	 * Set the issuerId
	 */	
	public void setIssuerId(Long aValue) {
		this.issuerId = aValue;
	}	

	/**
	 * 主题词	 * @return String
	 * @hibernate.property column="keywords" type="java.lang.String" length="256" not-null="false" unique="false"
	 */
	public String getKeywords() {
		return this.keywords;
	}
	
	/**
	 * Set the keywords
	 */	
	public void setKeywords(String aValue) {
		this.keywords = aValue;
	}	

	/**
	 * 公文来源
            仅在收文中指定，发公文不需要指定
            上级公文
            下级公文	 * @return String
	 * @hibernate.property column="sources" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getSources() {
		return this.sources;
	}
	
	/**
	 * Set the sources
	 */	
	public void setSources(String aValue) {
		this.sources = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="archType" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getArchType() {
		return this.archType;
	}
	
	/**
	 * Set the archType
	 * @spring.validator type="required"
	 */	
	public void setArchType(Short aValue) {
		this.archType = aValue;
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

	public java.util.Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(java.util.Date createtime) {
		this.createtime = createtime;
	}

	public Long getParentArchId() {
		return parentArchId;
	}

	public void setParentArchId(Long parentArchId) {
		this.parentArchId = parentArchId;
	}
	
	public short getIsArchive() {
		return isArchive;
	}

	public void setIsArchive(short isArchive) {
		this.isArchive = isArchive;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((archType == null) ? 0 : archType.hashCode());
		result = prime * result + ((archivesAttends == null) ? 0 : archivesAttends.hashCode());
		result = prime * result + ((archivesCCs == null) ? 0 : archivesCCs.hashCode());
		result = prime * result + ((archivesDeps == null) ? 0 : archivesDeps.hashCode());
		result = prime * result + ((archivesDispatch == null) ? 0 : archivesDispatch.hashCode());
		result = prime * result + ((archivesDocs == null) ? 0 : archivesDocs.hashCode());
		result = prime * result + ((archivesHandles == null) ? 0 : archivesHandles.hashCode());
		result = prime * result + ((archivesId == null) ? 0 : archivesId.hashCode());
		result = prime * result + ((archivesNo == null) ? 0 : archivesNo.hashCode());
		result = prime * result + ((createtime == null) ? 0 : createtime.hashCode());
		result = prime * result + ((depSignNo == null) ? 0 : depSignNo.hashCode());
		result = prime * result + ((department == null) ? 0 : department.hashCode());
		result = prime * result + ((fileCounts == null) ? 0 : fileCounts.hashCode());
		result = prime * result + ((handlerUids == null) ? 0 : handlerUids.hashCode());
		result = prime * result + ((handlerUnames == null) ? 0 : handlerUnames.hashCode());
		result = prime * result + isArchive;
		result = prime * result + ((issueDate == null) ? 0 : issueDate.hashCode());
		result = prime * result + ((issueDep == null) ? 0 : issueDep.hashCode());
		result = prime * result + ((issuer == null) ? 0 : issuer.hashCode());
		result = prime * result + ((issuerId == null) ? 0 : issuerId.hashCode());
		result = prime * result + ((keywords == null) ? 0 : keywords.hashCode());
		result = prime * result + ((leaders == null) ? 0 : leaders.hashCode());
		result = prime * result + ((odFlowtype == null) ? 0 : odFlowtype.hashCode());
		result = prime * result + ((orgArchivesId == null) ? 0 : orgArchivesId.hashCode());
		result = prime * result + ((parentArchId == null) ? 0 : parentArchId.hashCode());
		result = prime * result + ((privacyLevel == null) ? 0 : privacyLevel.hashCode());
		result = prime * result + ((processRun == null) ? 0 : processRun.hashCode());
		result = prime * result + ((recDepIds == null) ? 0 : recDepIds.hashCode());
		result = prime * result + ((recDepNames == null) ? 0 : recDepNames.hashCode());
		result = prime * result + ((shortContent == null) ? 0 : shortContent.hashCode());
		result = prime * result + ((sources == null) ? 0 : sources.hashCode());
		result = prime * result + ((status == null) ? 0 : status.hashCode());
		result = prime * result + ((subject == null) ? 0 : subject.hashCode());
		result = prime * result + ((typeName == null) ? 0 : typeName.hashCode());
		result = prime * result + ((urgentLevel == null) ? 0 : urgentLevel.hashCode());
		result = prime * result + ((electronicDocDate == null) ? 0 : electronicDocDate.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Archives other = (Archives) obj;
		if (archType == null) {
			if (other.archType != null)
				return false;
		} else if (!archType.equals(other.archType))
			return false;
		if (archivesAttends == null) {
			if (other.archivesAttends != null)
				return false;
		} else if (!archivesAttends.equals(other.archivesAttends))
			return false;
		if (archivesCCs == null) {
			if (other.archivesCCs != null)
				return false;
		} else if (!archivesCCs.equals(other.archivesCCs))
			return false;
		if (archivesDeps == null) {
			if (other.archivesDeps != null)
				return false;
		} else if (!archivesDeps.equals(other.archivesDeps))
			return false;
		if (archivesDispatch == null) {
			if (other.archivesDispatch != null)
				return false;
		} else if (!archivesDispatch.equals(other.archivesDispatch))
			return false;
		if (archivesDocs == null) {
			if (other.archivesDocs != null)
				return false;
		} else if (!archivesDocs.equals(other.archivesDocs))
			return false;
		if (archivesHandles == null) {
			if (other.archivesHandles != null)
				return false;
		} else if (!archivesHandles.equals(other.archivesHandles))
			return false;
		if (archivesId == null) {
			if (other.archivesId != null)
				return false;
		} else if (!archivesId.equals(other.archivesId))
			return false;
		if (archivesNo == null) {
			if (other.archivesNo != null)
				return false;
		} else if (!archivesNo.equals(other.archivesNo))
			return false;
		if (createtime == null) {
			if (other.createtime != null)
				return false;
		} else if (!createtime.equals(other.createtime))
			return false;
		if (depSignNo == null) {
			if (other.depSignNo != null)
				return false;
		} else if (!depSignNo.equals(other.depSignNo))
			return false;
		if (department == null) {
			if (other.department != null)
				return false;
		} else if (!department.equals(other.department))
			return false;
		if (fileCounts == null) {
			if (other.fileCounts != null)
				return false;
		} else if (!fileCounts.equals(other.fileCounts))
			return false;
		if (handlerUids == null) {
			if (other.handlerUids != null)
				return false;
		} else if (!handlerUids.equals(other.handlerUids))
			return false;
		if (handlerUnames == null) {
			if (other.handlerUnames != null)
				return false;
		} else if (!handlerUnames.equals(other.handlerUnames))
			return false;
		if (isArchive != other.isArchive)
			return false;
		if (issueDate == null) {
			if (other.issueDate != null)
				return false;
		} else if (!issueDate.equals(other.issueDate))
			return false;
		if (issueDep == null) {
			if (other.issueDep != null)
				return false;
		} else if (!issueDep.equals(other.issueDep))
			return false;
		if (issuer == null) {
			if (other.issuer != null)
				return false;
		} else if (!issuer.equals(other.issuer))
			return false;
		if (issuerId == null) {
			if (other.issuerId != null)
				return false;
		} else if (!issuerId.equals(other.issuerId))
			return false;
		if (keywords == null) {
			if (other.keywords != null)
				return false;
		} else if (!keywords.equals(other.keywords))
			return false;
		if (leaders == null) {
			if (other.leaders != null)
				return false;
		} else if (!leaders.equals(other.leaders))
			return false;
		if (odFlowtype == null) {
			if (other.odFlowtype != null)
				return false;
		} else if (!odFlowtype.equals(other.odFlowtype))
			return false;
		if (orgArchivesId == null) {
			if (other.orgArchivesId != null)
				return false;
		} else if (!orgArchivesId.equals(other.orgArchivesId))
			return false;
		if (parentArchId == null) {
			if (other.parentArchId != null)
				return false;
		} else if (!parentArchId.equals(other.parentArchId))
			return false;
		if (privacyLevel == null) {
			if (other.privacyLevel != null)
				return false;
		} else if (!privacyLevel.equals(other.privacyLevel))
			return false;
		if (processRun == null) {
			if (other.processRun != null)
				return false;
		} else if (!processRun.equals(other.processRun))
			return false;
		if (recDepIds == null) {
			if (other.recDepIds != null)
				return false;
		} else if (!recDepIds.equals(other.recDepIds))
			return false;
		if (recDepNames == null) {
			if (other.recDepNames != null)
				return false;
		} else if (!recDepNames.equals(other.recDepNames))
			return false;
		if (shortContent == null) {
			if (other.shortContent != null)
				return false;
		} else if (!shortContent.equals(other.shortContent))
			return false;
		if (sources == null) {
			if (other.sources != null)
				return false;
		} else if (!sources.equals(other.sources))
			return false;
		if (status == null) {
			if (other.status != null)
				return false;
		} else if (!status.equals(other.status))
			return false;
		if (subject == null) {
			if (other.subject != null)
				return false;
		} else if (!subject.equals(other.subject))
			return false;
		if (typeName == null) {
			if (other.typeName != null)
				return false;
		} else if (!typeName.equals(other.typeName))
			return false;
		if (urgentLevel == null) {
			if (other.urgentLevel != null)
				return false;
		} else if (!urgentLevel.equals(other.urgentLevel))
			return false;
		if (electronicDocDate == null) {
			if (other.electronicDocDate != null)
				return false;
		} else if (!electronicDocDate.equals(other.electronicDocDate))
			return false;
		return true;
	}

	public Set getArchivesDocs() {
		return archivesDocs;
	}

	public void setArchivesDocs(Set archivesDocs) {
		this.archivesDocs = archivesDocs;
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

	public java.util.Date getLimitedDate() {
		return limitedDate;
	}

	public void setLimitedDate(java.util.Date limitedDate) {
		this.limitedDate = limitedDate;
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

	public java.util.Date getWrittenDate() {
		return writtenDate;
	}

	public void setWrittenDate(java.util.Date writtenDate) {
		this.writtenDate = writtenDate;
	}

	public String getOrgDepName() {
		return orgDepName;
	}

	public void setOrgDepName(String orgDepName) {
		this.orgDepName = orgDepName;
	}

	public Long getSignUserId() {
		return signUserId;
	}

	public void setSignUserId(Long signUserId) {
		this.signUserId = signUserId;
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

	public java.util.Date getReceiveDate() {
		return receiveDate;
	}

	public void setReceiveDate(java.util.Date receiveDate) {
		this.receiveDate = receiveDate;
	}

	public String getExamineRecordNumber() {
		return examineRecordNumber;
	}

	public void setExamineRecordNumber(String examineRecordNumber) {
		this.examineRecordNumber = examineRecordNumber;
	}
	
}
