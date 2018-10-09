package com.gdssoft.oa.action.admin;

import javax.annotation.Resource;

import com.gdssoft.oa.model.admin.ConfSummary;
import com.gdssoft.oa.service.admin.ConfSummaryService;
import com.gdssoft.core.web.action.BaseAction;

/**
 * @description 会议纪要详细信息展示
 * @author YHZ
 * @data 2010-11-1 PM
 * 
 */
public class ConfSummaryDetailAction extends BaseAction {

	@Resource
	private ConfSummaryService confSummaryService;

	private Long sumId; // 会议纪要编号
	private ConfSummary confSummary;

	public Long getSumId() {
		return sumId;
	}

	public void setSumId(Long sumId) {
		this.sumId = sumId;
	}

	public ConfSummary getConfSummary() {
		return confSummary;
	}

	public void setConfSummary(ConfSummary confSummary) {
		this.confSummary = confSummary;
	}

	@Override
	public String execute() throws Exception {
		confSummary = confSummaryService.get(sumId);
		return SUCCESS;
	}
}
