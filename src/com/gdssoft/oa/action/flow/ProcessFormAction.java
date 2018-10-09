package com.gdssoft.oa.action.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.jbpm.api.ProcessInstance;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;


/**
 * 
 * @author csx
 *
 */
public class ProcessFormAction extends BaseAction{
	@Resource
	private ProcessFormService processFormService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ArchivesService archivesService;
	private ProcessForm processForm;
	
	private Long formId;

	public Long getFormId() {
		return formId;
	}

	public void setFormId(Long formId) {
		this.formId = formId;
	}

	public ProcessForm getProcessForm() {
		return processForm;
	}

	public void setProcessForm(ProcessForm processForm) {
		this.processForm = processForm;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<ProcessForm> list= processFormService.getAll(filter);
		
		Type type=new TypeToken<List<ProcessForm>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				processFormService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		ProcessForm processForm=processFormService.get(formId);
		JSONSerializer json = new JSONSerializer();
		//将数据转成JSON格式
		StringBuffer buff = new StringBuffer("{success:true,data:");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), new String[] {"createtime"});
		buff.append(json.exclude(new String[] { "class","processRun" }).serialize(processForm));
		buff.append("}");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String runId=getRequest().getParameter("runId");
		String creatorName=getRequest().getParameter("creatorName");
		String creatorId=getRequest().getParameter("creatorId");
		if(creatorId!=null&&!"".equals(creatorId)&&creatorName!=null){
			processForm.setCreatorId(new Long(creatorId));
			processForm.setCreatorName(creatorName);
		}
		if(runId!=null&&!"".equals(runId)){
			ProcessRun processRun=processRunService.get(new Long(runId));
			processForm.setProcessRun(processRun);
		}
		processForm.setCreatetime(new Date());
		processFormService.save(processForm);
		setJsonString("{success:true}");
		return SUCCESS;
	}
	/**
	 * 流程详细信息
	 */
	public String detail(){
		String runId=getRequest().getParameter("runId");
		String taskId=getRequest().getParameter("taskId");
		if(StringUtils.isNotBlank(taskId)&&taskId!=null&&!"undefined".equals(taskId)){
			ProcessInstance pis=jbpmService.getProcessInstanceByTaskId(taskId);
			ProcessRun processRun=processRunService.getByPiId(pis.getId());
			runId=processRun.getRunId().toString();
		}
		List pfList=processFormService.getByRunId(new Long(runId));
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(pfList.size()).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), new String[] {"createtime"});
		buff.append(json.exclude(new String[] { "class" }).serialize(pfList));
		buff.append("}");
		jsonString=buff.toString();
		return SUCCESS;
	}
	/**
	 * 代填意见
	 */
	public String saveOpin(){
		SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String runId=getRequest().getParameter("runId");
		String time=getRequest().getParameter("createtime");
		String creatortime = time + ":00";
		if(processForm.getFormId()==null){
			try {
				processForm.setCreatetime(formatter.parse(creatortime));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			if(runId!=null&&!"".equals(runId)){
				ProcessRun processRun=processRunService.get(new Long(runId));
				processForm.setProcessRun(processRun);
			}
			processForm.setType((long) 2);
			//processForm.setStatus("代填意见");
			processFormService.save(processForm);
		}else{
			ProcessForm orgForm=processFormService.get(processForm.getFormId());
			orgForm.setComments(processForm.getComments());
			processFormService.save(orgForm);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
