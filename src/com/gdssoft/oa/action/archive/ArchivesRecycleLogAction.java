package com.gdssoft.oa.action.archive;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.jfree.util.Log;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.ArchivesRecycleLog;
import com.gdssoft.oa.model.archive.DocHistory;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.archive.ArchivesRecycleLogService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.archive.DocHistoryService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.flow.impl.ProcessRunServiceImpl;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class ArchivesRecycleLogAction extends BaseAction {
	@Resource
	private ArchivesRecycleLogService logService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ArchivesService archivesService;


	private Long logId;

	public Long getlogId() {
		return logId;
	}

	public void setlogId(Long logId) {
		this.logId = logId;
	}

	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		String startDate=getRequest().getParameter("startDate");
		String endDate =getRequest().getParameter("endDate");
		if(StringUtils.isNotEmpty(startDate)){
			filter.addFilter("Q_createDate_D_GE", startDate);
		}
		if(StringUtils.isNotEmpty(endDate)){
			filter.addFilter("Q_createDate_D_LE", endDate);
		}
		AppUser user = ContextUtil.getCurrentUser();
		if(!user.getIsAdminORArch()){
			filter.addFilter("Q_archives.issuerId_L_EQ", user.getUserId()+"");
		}
		List<ArchivesRecycleLog> list = logService.getAll(filter);
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(filter.getPagingBean().getTotalItems()).append(",\"result\":");
		JSONSerializer json = JsonUtil.getJSONSerializer("createDate","updateDate");
		buff.append(json.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 彻底删除 批量彻底删除
	 * 
	 * @return
	 */
	public String multiDel() {
		String[] ids = getRequest().getParameterValues("logIds");
		AppUser user = ContextUtil.getCurrentUser();
		if (ids != null) {
			for (String id : ids) {
				ArchivesRecycleLog recycleLog = logService.get(new Long(id));
				ProcessRun processRun=processRunService.get(recycleLog.getProcessRun().getRunId());
			    recycleLog.setUpdateDate(new Date());
			    recycleLog.setLogType(ArchivesRecycleLog.TYPE_DELETE);
			    recycleLog.setUpdateUser(user);
			    recycleLog.setUpdateName(user.getFullname());
			    logService.save(recycleLog);
				System.out.println("--piId--" + recycleLog.getPiid());
				processRun.setPiId(null);
				processRun.setRunStatus(ProcessRun.RUN_STATUS_STOPED);
				processRunService.stopProcessRun(processRun);
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}
	/**
	 * 恢复 批量恢复 流程
	 */
	public String recover() {
		String[] logIds =getRequest().getParameterValues("logIds");
		AppUser user = ContextUtil.getCurrentUser();
		if (logIds != null) {
		for(String id:logIds){
			ArchivesRecycleLog recycleLog = logService.get(new Long(id));
		    recycleLog.setUpdateDate(new Date());
		    recycleLog.setLogType(ArchivesRecycleLog.TYPE_RECOVER);
		    recycleLog.setUpdateUser(user);
		    recycleLog.setUpdateName(user.getFullname());
		    logService.save(recycleLog);
		    ProcessRun processRun=processRunService.get(recycleLog.getProcessRun().getRunId());
		    processRun.setPiId(recycleLog.getPiid());
		    processRun.setRunStatus(ProcessRun.RUN_STATUS_RUNNING);
		    processRunService.save(processRun);
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}
}
