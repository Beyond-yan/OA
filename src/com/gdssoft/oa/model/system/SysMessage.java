package com.gdssoft.oa.model.system;

import java.util.Date;

public class SysMessage extends com.gdssoft.core.model.BaseModel{
	private long id;
	private String subject;
	private long original_id;
	private int original_type;
	private long to_user;
	private Date create_date;
	private int read_flag;
	private long taskId;
	private long runId;
	
	public long getTaskId() {
		return taskId;
	}

	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}

	public long getRunId() {
		return runId;
	}

	public void setRunId(long runId) {
		this.runId = runId;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public long getOriginal_id() {
		return original_id;
	}
	public void setOriginal_id(long original_id) {
		this.original_id = original_id;
	}
	public int getOriginal_type() {
		return original_type;
	}

	public void setOriginal_type(int original_type) {
		this.original_type = original_type;
	}


	public long getTo_user() {
		return to_user;
	}
	public void setTo_user(long to_user) {
		this.to_user = to_user;
	}
	public Date getCreate_date() {
		return create_date;
	}
	public void setCreate_date(Date create_date) {
		this.create_date = create_date;
	}
	public int getRead_flag() {
		return read_flag;
	}
	public void setRead_flag(int read_flag) {
		this.read_flag = read_flag;
	}
	
}
