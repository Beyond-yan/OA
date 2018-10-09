package com.gdssoft.oa.action.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jbpm.api.ProcessInstance;
import org.jbpm.api.task.Task;
import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.info.NewsComment;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.util.StringUtil;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.DateUtil;
import com.gdssoft.core.web.action.BaseAction;

/**
 * 显示运行中的流程信息
 * @author csx
 *
 */
public class ReceiveProcessRunDetailAction extends BaseAction{
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ProcessFormService processFormService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private ArchivesService archivesService;
	private Log logger = LogFactory.getLog(ReceiveProcessRunDetailAction.class);
	private Long runId;

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
	/**
	 * 获取收文审批信息
	 */
	public String list() {
		logger.info("------获取收文审批信息-------");
		ProcessRun processRun=null;
		//runId 父流程实例piId
		if(runId==null){
			ProcessInstance pis=jbpmService.getProcessInstanceByTaskId(taskId.toString());
			processRun=processRunService.getByPiId(pis.getId());
			getRequest().setAttribute("processRun", processRun);
			runId=processRun.getRunId();
		}else{
			processRun=processRunService.get(runId);
		}
		//收文实体
		Archives archives = archivesService.getArchivesByRunId(runId);
		Long parentId = archives.getArchivesId();
		//根据发文流程ID获取所有收文实体
		List<Archives> subArcivesList = archivesService.getArchivesByParentId(parentId);
		//拼装收文审批信息用于前台展示
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(subArcivesList.size()).append(",\"result\":[");
		for(Archives subArchive : subArcivesList){
			processRun=subArchive.getProcessRun();
			
			String piId = processRun.getPiId();
			
			List pfList=processFormService.getByRunId(processRun.getRunId());
			logger.info("pfList:"+pfList);
			String isQianshou = "";
			if(null != pfList){
				int size = pfList.size();
				if(size > 1){
					isQianshou ="<b>已签收</b>";
				}else {
					isQianshou ="<b>未签收</b>";
				}
				
				if(processRun.getRunStatus()==ProcessRun.RUN_STATUS_FINISHED){
					isQianshou ="<b>已结束</b>";
				}else if(processRun.getRunStatus()==ProcessRun.RUN_STATUS_STOPED){
					isQianshou ="<b>已终止</b>";
				}
			}
			
			//String nextPerson = getNextStepPerson(piId);
			Map<String,String> map = getNextStepPerson(piId);
			buff.append("{\"recDepName\":\"")
				.append("<b>"+subArchive.getRecDepNames()+"</b>")
				.append("\",\"status\":\"").append(isQianshou)
				.append("\",\"runStatus\":").append(processRun.getRunStatus())
				.append(",\"nextPerson\":\"")
				.append("<b>"+map.get("userName")+"</b>")
				.append("\",\"taskName\":\"")
				.append("<b>"+map.get("taskName")+"</b>")
				.append("\",\"detail\":\"")
				.append("<div class='x-grid-group-title' style='margin-left:10%'>")
				.append("<table class='table-info' cellpadding='0' cellspacing='1' width='96%'>")
				.append("<tr>")
				.append("<th width='50'>任务名</th><th width='60'>执行人</th><th width='80'>开始于</th><th width='90'>处理结果</th><th width='300'>意见</th>")
				.append("</tr>");
				for(Object o : pfList){
					ProcessForm  pf = (ProcessForm)o;
					
					String comment=pf.getComments();
					if(comment!=null){
						comment=comment.replaceAll("\"","”");
					}
					buff.append("<tr>")
					.append("<td>").append(pf.getActivityName()).append("</td>")
					.append("<td>").append(pf.getCreatorName()).append("</td>")
					.append("<td>").append(DateUtil.formatEnDate(pf.getCreatetime())).append("</td>")
					.append("<td>").append(pf.getStatus() == null ? "":pf.getStatus()).append("</td>")
					.append("<td>").append(pf.getComments()== null ? "":StringUtil.replaceBlank(comment)).append("</td>");
				}
				buff.append("</table>")
				.append("</div>")
				.append("\"},");
			
		}
		if(subArcivesList.size()>0){
			buff.deleteCharAt(buff.length()-1);
		}
		buff.append("]}");
		setJsonString(buff.toString());
		
		return SUCCESS;
	}
	/**
	 * 获取流程下一步执行人
	 * @author F3222507
	 * @param piId
	 * @return
	 */
	public Map<String,String> getNextStepPerson(String piId){
		Map<String,String> map = new HashMap<String, String>();
		String s = "";
		if(piId !=null && !"".equals(piId)){
			List<Task> tasks = jbpmService.getTasksByPiId(piId);
			String userId = null;
			StringBuilder sb = new StringBuilder();
			if(tasks !=null){
				for(Task task:tasks) {
					logger.info("userId："+userId);
					System.out.println("----userIdTask1----"+userId);
					userId=task.getAssignee();
					System.out.println("----userIdTask2----"+userId);
					if(userId!=null){
						System.out.println("----test122----");
						AppUser appUser = appUserService.get(Long.valueOf(userId));
						sb.append(appUser.getFullname()).append(",");
						map.put("userName", sb.toString().substring(0, sb.toString().length()-1));
						map.put("taskName", task.getActivityName());
					}
					Set<Task> suTasks = ((TaskImpl)task).getSubTasks();
					logger.info("suTasks:"+suTasks);
					System.out.println("----suTasks1:----"+suTasks.size());
					if(userId==null && suTasks.size()!=0){
						System.out.println("----test133----"); 
						for(Task t:suTasks){
							userId = t.getAssignee();
							AppUser appUser = appUserService.get(Long.valueOf(userId));
							sb.append(appUser.getFullname()).append(",");
						}
						map.put("userName", sb.toString().substring(0, sb.toString().length()-1));
						map.put("taskName", task.getActivityName());
						
					}
					if(userId==null && suTasks.size()==0){
						System.out.println("----test144----"); 
						sb.append("该任务还没有人锁定").append(",");
						map.put("userName", sb.toString().substring(0, sb.toString().length()-1));
						map.put("taskName", task.getActivityName());
					}
				
				}
			}
			
			if(sb.length()>0){
				s = sb.toString().substring(0, sb.toString().length()-1);
			}
			logger.info("下一步执行人:"+s);
		}else {
			s = "流程已结束";
			map.put("userName", s);
			map.put("taskName", "");
		}
		return map;
	}
	
	public static void main(String[] args) {
		String comments = "abc\"dddd";
		comments=comments.replaceAll("\"","“");
		System.out.println(comments);
		System.out.println("\\");
		System.out.println("\\\"");
			String scomments = comments.replace('"', ',');
			System.out.println(scomments);
		
	}
}
