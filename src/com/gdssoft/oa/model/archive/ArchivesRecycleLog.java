package com.gdssoft.oa.model.archive;

import java.util.Date;

import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;

/**
 * 公文操作记录
 * @author T460
 *
 */
public class ArchivesRecycleLog extends com.gdssoft.core.model.BaseModel{

	public final static Integer TYPE_ADD=1;//增加
	public final static Integer TYPE_RECOVER=2;//恢复
	public final static Integer TYPE_DEL=3;//删除
	public final static Integer TYPE_DELETE=4;//彻底删除

	/**
	 * 
	 */
	private static final long serialVersionUID = -291498784524088009L;
	/**
	 * 主键
	 */
	private Long id;
	/**
	 * 创建用户
	 */
	private AppUser user;
	/**
	 * 运行过程
	 */
	private ProcessRun process;
	/**
	 * 删除的档案
	 */
	private Archives archives;
	/**
	 * 操作类型（1增加、2修改、3删除、4、彻底删除）
	 */
	private Integer logType;
	/**
	 * 创建时间
	 */
	private Date createDate;
	/**
	 * 更新用户
	 */
	private AppUser updateUser;
	/**
	 * 更新用户名
	 */
	private String updateName;
	/**
	 * 更新时间
	 */
	private Date updateDate;
	public String getPiid() {
		return piid;
	}
	public void setPiid(String piid) {
		this.piid = piid;
	}
	private String piid;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public AppUser getUser() {
		return user;
	}
	public void setUser(AppUser user) {
		this.user = user;
	}
	
	public ProcessRun getProcessRun() {
		return process;
	}
	public void setProcessRun(ProcessRun process) {
		this.process = process;
	}
	public Integer getLogType() {
		return logType;
	}
	public void setLogType(Integer logType) {
		this.logType = logType;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public AppUser getUpdateUser() {
		return updateUser;
	}
	public void setUpdateUser(AppUser updateUser) {
		this.updateUser = updateUser;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public Archives getArchives() {
		return archives;
	}
	public void setArchives(Archives archives) {
		this.archives = archives;
	}
	public String getUpdateName() {
		return updateName;
	}
	public void setUpdateName(String updateName) {
		this.updateName = updateName;
	}
	
}
