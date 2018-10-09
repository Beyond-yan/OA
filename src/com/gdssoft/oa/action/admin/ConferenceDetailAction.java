package com.gdssoft.oa.action.admin;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import javax.annotation.Resource;

import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.service.admin.ConferenceService;
import com.gdssoft.core.web.action.BaseAction;

/**
 * @description 会议内容详细信息展示
 * @author YHZ
 * @datetime : 2010-10-29AM
 */
public class ConferenceDetailAction extends BaseAction {

	@Resource
	private ConferenceService conferenceService;

	private Long confId;
	private Conference conference;

	public Conference getConference() {
		return conference;
	}

	public void setConference(Conference conference) {
		this.conference = conference;
	}

	public Long getConfId() {
		return confId;
	}

	public void setConfId(Long confId) {
		this.confId = confId;
	}

	@Override
	public String execute() throws Exception {
			conference = conferenceService.get(confId);
		return SUCCESS;
	}

}
