package com.gdssoft.oa.action.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jbpm.api.ProcessInstance;
import org.jbpm.api.task.Task;
import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.oa.action.archive.ArchivesAction;
import com.gdssoft.oa.model.flow.JbpmTask;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.util.ListComparator;
import com.gdssoft.core.jbpm.jpdl.Node;
import com.gdssoft.core.web.action.BaseAction;

/**
 * 显示运行中的流程信息
 * @author csx
 *
 */
public class ProcessRunDetailAction extends BaseAction{
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ProcessFormService processFormService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private AppUserService appUserService;
	private Long runId;
	private Log logger = LogFactory.getLog(ProcessRunDetailAction.class);
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

	@Override
	public String execute() throws Exception {
		logger.info("---------加载流程审批信息----------");
		ProcessRun processRun=null;
		if(runId==null){
			ProcessInstance pis=jbpmService.getProcessInstanceByTaskId(taskId.toString());
			processRun=processRunService.getByPiId(pis.getId());
			getRequest().setAttribute("processRun", processRun);
			runId=processRun.getRunId();
		}else{
			processRun=processRunService.get(runId);
		}
		List pfList=processFormService.getByRunId(runId);
		String piId = processRun.getPiId();
		if(piId !=null && !"".equals(piId)){
			List<Task> tasks = jbpmService.getTasksByPiId(piId);
			String userId = null;
			StringBuilder sb = new StringBuilder();
			if(tasks !=null){
				for(Task task:tasks) {
					userId = task.getAssignee();				
					if(userId!=null){
						AppUser appUser = appUserService.get(Long.valueOf(userId));
						sb.append(appUser.getFullname()).append(",");
					}
					Set<Task> suTasks = ((TaskImpl)task).getSubTasks();
					System.out.println("suTasks:"+suTasks);
					if(userId==null && suTasks.size()!=0){
						for(Task t:suTasks){
							userId = t.getAssignee();
							AppUser appUser = appUserService.get(Long.valueOf(userId));
							sb.append(appUser.getFullname()).append(",");
						}
						
					}
					if(userId==null && suTasks.size()==0){
						sb.append("该任务还未分配执行人").append(",");
					}
				
				}
			}
			//存放下一步审批人
			if(sb.length()>0){
				String s = sb.toString().substring(0, sb.toString().length()-1);
				getRequest().setAttribute("s", s);
			}else{
				getRequest().setAttribute("s", sb.toString());
			}
		}else {

			getRequest().setAttribute("s", "流程已结束");

		}
		getRequest().setAttribute("pfList", pfList);
		return SUCCESS;
	} 
}
