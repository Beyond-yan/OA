package com.gdssoft.oa.model.archive;

import com.gdssoft.oa.model.system.AppUser;
import com.google.gson.annotations.Expose;

public class OdArchivescc {
	@Expose
	protected Long Id;
	@Expose
	protected Archives archives;
	@Expose
	protected java.util.Date readTime;
	@Expose
	protected Short status;
	@Expose
	protected java.util.Date givemeReadTime;
	@Expose
	protected String givemeReadUser;
	@Expose
	protected AppUser appUser;
	
	
	public Long getId() {
		return Id;
	}
	public void setId(Long id) {
		Id = id;
	}

	public Archives getArchives() {
		return archives;
	}
	public void setArchives(Archives archives) {
		this.archives = archives;
	}
	public Short getStatus() {
		return status;
	}
	public void setStatus(Short status) {
		this.status = status;
	}
	public String getGivemeReadUser() {
		return givemeReadUser;
	}
	public void setGivemeReadUser(String givemeReadUser) {
		this.givemeReadUser = givemeReadUser;
	}
	public java.util.Date getReadTime() {
		return readTime;
	}
	public void setReadTime(java.util.Date readTime) {
		this.readTime = readTime;
	}
	public java.util.Date getGivemeReadTime() {
		return givemeReadTime;
	}
	public void setGivemeReadTime(java.util.Date givemeReadTime) {
		this.givemeReadTime = givemeReadTime;
	}
	public AppUser getAppUser() {
		return appUser;
	}
	public void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}
//手动set进去的model值
	@Expose
	protected Long archivesId;
    @Expose
	protected String subject;//标题
    @Expose
	protected String issuer;//创建人
    @Expose
	protected java.util.Date createtime;//创建时间
	@Expose
	protected Long runId;
    @Expose
	protected Long defId;
    @Expose
    protected String taskName;//步骤名称
	@Expose
    protected String assignUserName;//当前办理人


	public Long getArchivesId() {
		return archivesId;
	}
	public void setArchivesId(Long archivesId) {
		this.archivesId = archivesId;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getIssuer() {
		return issuer;
	}
	public void setIssuer(String issuer) {
		this.issuer = issuer;
	}
	public java.util.Date getCreatetime() {
		return createtime;
	}
	public void setCreatetime(java.util.Date createtime) {
		this.createtime = createtime;
	}
	public Long getRunId() {
		return runId;
	}
	public void setRunId(Long runId) {
		this.runId = runId;
	}
	public Long getDefId() {
		return defId;
	}
	public void setDefId(Long defId) {
		this.defId = defId;
	}
	public String getTaskName() {
		return taskName;
	}
	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}
	public String getAssignUserName() {
		return assignUserName;
	}
	public void setAssignUserName(String assignUserName) {
		this.assignUserName = assignUserName;
	}

}
