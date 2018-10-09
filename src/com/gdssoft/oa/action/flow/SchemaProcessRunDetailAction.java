package com.gdssoft.oa.action.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jbpm.api.ProcessInstance;
import org.jbpm.api.task.Task;
import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.oa.action.archive.ArchivesAction;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;
import com.gdssoft.core.web.action.BaseAction;

/**
 * 显示运行中的流程信息
 * @author csx
 *
 */
public class SchemaProcessRunDetailAction extends BaseAction{
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ProcessFormService processFormService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private SysSchemaConfigService sysSchemaConfigService;
	private Long runId;
	private Long Schemacode;
	private Log logger = LogFactory.getLog(SchemaProcessRunDetailAction.class);
	public Long getRunId() {
		return runId;
	}

	public void setRunId(Long runId) {
		this.runId = runId;
	}

	private Long taskId;

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}



	public Long getSchemacode() {
		return Schemacode;
	}

	public void setSchemacode(Long schemacode) {
		this.Schemacode = schemacode;
	}

	@Override
	public String execute() throws Exception {
		logger.info("---------加载流程审批信息----------");
		SysSchemaConfig schema=sysSchemaConfigService.get(Schemacode);
		String schemacode=schema.getSchemaCode();
		List pfList=processFormService.getBySchemacodeRunId(runId, schemacode);
		//存放流程审批列表
		getRequest().setAttribute("pfList", pfList);
		
		return SUCCESS;
	}
}
