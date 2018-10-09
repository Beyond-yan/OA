package com.gdssoft.oa.job;

import java.util.Date;
import java.util.List;

import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.service.admin.ConferenceService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;

public class ConfChangeStatus extends BaseAction{
	private ConferenceService conferenceService;
	private Conference conference;
	private SysSchemaConfigService sysSchemaConfigService;
	
	
	
	public void setSysSchemaConfigService(
			SysSchemaConfigService sysSchemaConfigService) {
		this.sysSchemaConfigService = sysSchemaConfigService;
	}

	public void setConferenceService(ConferenceService conferenceService) {
		this.conferenceService = conferenceService;
	}
	public void autoStopConference(){
		List<SysSchemaConfig> schemaConfigList = sysSchemaConfigService.getDefaultSiteSchemas();
		for(SysSchemaConfig sysSchemaConfig : schemaConfigList){
			conferenceService.updateConferenceStatus(sysSchemaConfig.getSchemaCode(), -1, "SysetmAuto");
		}
		
	}



	// 将超出时间范围的日期设置为-1，表示会议已完成
	public void autoChangeStatus() {

		try {
			List<Conference> list = conferenceService.getAll();

			for (int i = 0; i < list.size(); i++) {
				if (list.get(i).getEndTime().compareTo(new java.util.Date()) < 0
						&& list.get(i).getApplyStatus() == 2) {
					System.out.println("========itime==========="
							+ list.get(i).getEndTime());
					System.out.println("========now==========="
							+ new java.util.Date());

					// 将超出时间范围的日期设置为-1，表示会议已完成
					// list.get(i).setApplyStatus((short)-1);
					Long confId = list.get(i).getConfId();

					conference = new Conference();
					Conference orgConference = conferenceService.get(confId);
					// 将超出时间范围的日期设置为-1，表示会议已完成
					conference.setApplyStatus((short) -1);
					conference.setUpdateBy("system");
					conference.setUpdateDate(new Date());
					BeanUtil.copyNotNullProperties(orgConference, conference);
					conferenceService.save(orgConference);

				}
			}
		} catch (Exception e) {
			e.printStackTrace();

		}

	}

}
