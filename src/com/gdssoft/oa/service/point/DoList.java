package com.gdssoft.oa.service.point;

import java.util.List;

import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.info.News;
import com.gdssoft.oa.model.info.Notice;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.oa.model.summary.WorkSummarySum;

public class DoList {

	public List<TaskInfo> taskInfos;// 流程待办
	public List<Conference> conferences;// 会议待办
	public List<News> newInfos;// 新闻待办
	public List<Notice> notices;// 通知
	public List<WorkSummary> workSummaries;// 工作总结
	public List<WorkSummarySum> wsSummarySums;// 工作总结汇总
	public Integer total;// 总的待办数量

	public List<TaskInfo> getTaskInfos() {
		return taskInfos;
	}

	public void setTaskInfos(List<TaskInfo> taskInfos) {
		this.taskInfos = taskInfos;
	}

	public List<Conference> getConferences() {
		return conferences;
	}

	public void setConferences(List<Conference> conferences) {
		this.conferences = conferences;
	}

	public List<News> getNewInfos() {
		return newInfos;
	}

	public void setNewInfos(List<News> newInfos) {
		this.newInfos = newInfos;
	}

	public List<Notice> getNotices() {
		return notices;
	}

	public void setNotices(List<Notice> notices) {
		this.notices = notices;
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}

	public List<WorkSummary> getWorkSummaries() {
		return workSummaries;
	}

	public void setWorkSummaries(List<WorkSummary> workSummaries) {
		this.workSummaries = workSummaries;
	}

	public List<WorkSummarySum> getWsSummarySums() {
		return wsSummarySums;
	}

	public void setWsSummarySums(List<WorkSummarySum> wsSummarySums) {
		this.wsSummarySums = wsSummarySums;
	}

}
