package com.gdssoft.oa.action.mobile.flow;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.velocity.tools.generic.DateTool;
import org.jbpm.api.ProcessDefinition;
import org.jbpm.api.ProcessInstance;
import org.jbpm.api.task.Task;
//import org.jbpm.pvm.internal.model.Transition;
import org.jbpm.api.model.Transition;
import org.jbpm.pvm.internal.task.ParticipationImpl;
import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.core.Constants;
import com.gdssoft.core.jbpm.pv.ParamField;
import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.action.flow.ProcessActivityAssistant;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesAttend;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.LeaderRead;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.flow.Transform;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
/**
 * 手机流程任务处理类
 * @author IBM
 *
 */
public class MobileTaskAction extends BaseAction{
	@Resource
	private ProcessRunService processRunService;	
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private ProcessFormService processFormService;	
	@Resource
	private ArchivesService archivesService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private DepartmentService departmentService;
	@Resource
	private SmsMobileService smsMobileService;
	
	private LeaderRead leaderRead;
	private Archives archives;
	
	
	SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");	
	//private Long leaderRead_readId;	
	/**
	 * 流程定义 ID
	 */
	private Long defId;	
	/**
	 * 任务ID
	 */
	private String taskId;	

	/**
	 * 流程名称
	 */
	private String processName;
	/**
	 * 流程名称
	 */
	private String taskName;	
	private  Archives arch;
	private String stringUrl="";	
	private String formatDate="";	
	private String getLeadersString="";
	private String activityName;
	private Long vgemgId;
	private Long archiveId;
	private Long gemgId; //总经理id
	private Long readId;
	private Long  flowAssignId2; //外发文收发人ID
	private String getDepartments="";//获取所有的部门
	private String handleOpinion;//外收文收文拟办的意见
	private String depIds;
	private String choosePartments;
	private Short isHandle;	
	private String getUserIdsString="";	
	private Short archUserType;
	private String readFeedback;
	private Long cruArchDepId;
	private ArchivesAttend archivesAttend;
	private String signUserIds;	
	private String readerIds;//内收文批办时的传阅人Id，只用get、set取，getRequest取不到
	private String undertakeIds;//内收文批办时的承办人Id，只用get、set取，getRequest取不到
	private String isOfficeLeader2;
	//private String officeLeaderString;//室进来字符串
	private String shaoSongString="";
	private String cruArchDepName;
	private String archives_issuer;
	private boolean isOfficeManager=false;
	private Long officeDepId;
	
	public String getProcessName() {
		return processName;
	}
	public void setProcessName(String processName) {
		this.processName = processName;
	}
	public String getTaskName() {
		return taskName;
	}
	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}	
	public Archives getArch() {
		return arch;
	}
	public void setArch(Archives arch) {
		this.arch = arch;
	}
	/**
	 * 出口跳转列表
	 */
	private List outTrans=new ArrayList();	
	/**
	 * Velocity模板路径
	 */
	private String vmPath;
	
	private Long runId;

	public String getVmPath() {
		return vmPath;
	}

	public void setVmPath(String vmPath) {
		this.vmPath = vmPath;
	}

	public List getOutTrans() {
		return outTrans;
	}

	public void setOutTrans(List outTrans) {
		this.outTrans = outTrans;
	}

	public String getStringUrl() {
		return stringUrl;
	}

	public void setStringUrl(String stringUrl) {
		this.stringUrl = stringUrl;
	}


	public String getFormatDate() {
		return formatDate;
	}

	public void setFormatDate(String formatDate) {
		this.formatDate = formatDate;
	}


	public String getGetLeadersString() {
		return getLeadersString;
	}

	public void setGetLeadersString(String getLeadersString) {
		this.getLeadersString = getLeadersString;
	}

	public String getActivityName() {
		return activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}


	public Long getVgemgId() {
		return vgemgId;
	}

	public void setVgemgId(Long vgemgId) {
		this.vgemgId = vgemgId;
	}

	public Long getArchiveId() {
		return archiveId;
	}
	public void setArchiveId(Long archiveId) {
		this.archiveId = archiveId;
	}

	public Long getGemgId() {
		return gemgId;
	}

	public void setGemgId(Long gemgId) {
		this.gemgId = gemgId;
	}

	public LeaderRead getLeaderRead() {
		return leaderRead;
	}

	public void setLeaderRead(LeaderRead leaderRead) {
		this.leaderRead = leaderRead;
	}

	public Archives getArchives() {
		return archives;
	}

	public void setArchives(Archives archives) {
		this.archives = archives;
	}

	
	public Long getReadId() {
		return readId;
	}
	public Long getFlowAssignId2() {
		return flowAssignId2;
	}
	public void setFlowAssignId2(Long flowAssignId2) {
		this.flowAssignId2 = flowAssignId2;
	}
	public void setReadId(Long readId) {
		this.readId = readId;
	}
	
	
	public String getGetDepartments() {
		return getDepartments;
	}
	public void setGetDepartments(String getDepartments) {
		this.getDepartments = getDepartments;
	}
	
	public String getHandleOpinion() {
		return handleOpinion;
	}
	public void setHandleOpinion(String handleOpinion) {
		this.handleOpinion = handleOpinion;
	}
	

	
	public String getDepIds() {
		return depIds;
	}
	public void setDepIds(String depIds) {
		this.depIds = depIds;
	}
	public String getChoosePartments() {
		return choosePartments;
	}
	public void setChoosePartments(String choosePartments) {
		this.choosePartments = choosePartments;
	}
	
	
	public Short getIsHandle() {
		return isHandle;
	}
	public void setIsHandle(Short isHandle) {
		this.isHandle = isHandle;
	}
	
	public Long getRunId() {
		return runId;
	}

	public void setRunId(Long runId) {
		this.runId = runId;
	}
	
	
	public Short getArchUserType() {
		return archUserType;
	}
	public void setArchUserType(Short archUserType) {
		this.archUserType = archUserType;
	}
	public String getGetUserIdsString() {
		return getUserIdsString;
	}
	public void setGetUserIdsString(String getUserIdsString) {
		this.getUserIdsString = getUserIdsString;
	}
	
	
	public String getReadFeedback() {
		return readFeedback;
	}
	public void setReadFeedback(String readFeedback) {
		this.readFeedback = readFeedback;
	}
	
	
	public Long getCruArchDepId() {
		return cruArchDepId;
	}
	public void setCruArchDepId(Long cruArchDepId) {
		this.cruArchDepId = cruArchDepId;
	}
	
	public ArchivesAttend getArchivesAttend() {
		return archivesAttend;
	}

	public void setArchivesAttend(ArchivesAttend archivesAttend) {
		this.archivesAttend = archivesAttend;
	}
	
	
	public String getSignUserIds() {
		return signUserIds;
	}
	public void setSignUserIds(String signUserIds) {
		this.signUserIds = signUserIds;
	}
	
	
	
	
	public String getReaderIds() {
		return readerIds;
	}
	public void setReaderIds(String readerIds) {
		this.readerIds = readerIds;
	}
	public String getUndertakeIds() {
		return undertakeIds;
	}
	public void setUndertakeIds(String undertakeIds) {
		this.undertakeIds = undertakeIds;
	}
	
	
	
	public String getIsOfficeLeader2() {
		return isOfficeLeader2;
	}
	public void setIsOfficeLeader2(String isOfficeLeader2) {
		this.isOfficeLeader2 = isOfficeLeader2;
	}
	
	
	public String getShaoSongString() {
		return shaoSongString;
	}
	public void setShaoSongString(String shaoSongString) {
		this.shaoSongString = shaoSongString;
	}
	
	
	public String getCruArchDepName() {
		return cruArchDepName;
	}
	public void setCruArchDepName(String cruArchDepName) {
		this.cruArchDepName = cruArchDepName;
	}
	
	
	
	public String getArchives_issuer() {
		return archives_issuer;
	}
	public void setArchives_issuer(String archivesIssuer) {
		archives_issuer = archivesIssuer;
	}
	
	
	
	public boolean isOfficeManager() {
		return isOfficeManager;
	}
	public void setOfficeManager(boolean isOfficeManager) {
		this.isOfficeManager = isOfficeManager;
	}
	
	
	public Long getOfficeDepId() {
		return officeDepId;
	}
	public void setOfficeDepId(Long officeDepId) {
		this.officeDepId = officeDepId;
	}
	@Resource(name="flowTaskService")
	private com.gdssoft.oa.service.flow.TaskService flowTaskService;
	
	@Resource
	private JbpmService jbpmService;
	
	public String list(){

		//PagingBean pb= getInitPagingBean();
		PagingBean pb = new PagingBean(0, 99999);
		//List<TaskInfo> tasks=flowTaskService.getTaskInfosByUserId(ContextUtil.getCurrentUserId().toString(),pb);
		List<TaskInfo> tasks=flowTaskService.getTaskInfosForFileByUserId(ContextUtil.getCurrentUserId().toString(),pb);
	/*for(int i=0;i<tasks.size();i++){		
		String tasks1=tasks.get(i).getPdId();
		Long tasks2=tasks.get(i).getTaskId();
		String strname=tasks.get(i).getTaskName();	
		
		}*/
		getRequest().setAttribute("taskList", tasks);
		getRequest().setAttribute("listCount", tasks.size());
		
		java.util.Date date = new java.util.Date();
		//java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyy年MM月dd日 hh:mm", java.util.Locale.CHINA);		
		java.text.SimpleDateFormat format= new java.text.SimpleDateFormat("yyyy年MM月dd日 HH:mm", java.util.Locale.CHINA);
		footDateTime = format.format(date);
		return SUCCESS;
	}

	//原系统的next方法
	public String next(){
		taskId=getRequest().getParameter("taskId");
		
		if(StringUtils.isNotEmpty(taskId)){
			TaskImpl task=(TaskImpl)jbpmService.getTaskById(taskId);
			taskName=task.getName();			
    		ProcessDefinition pd=jbpmService.getProcessDefinitionByTaskId(taskId);
    		ProDefinition systemProDef=proDefinitionService.getByDeployId(pd.getDeploymentId());
    		processName=systemProDef.getName();        		
    		vmPath=processName+ "/" + taskName;
    		String viewPath=getSession().getServletContext().getRealPath("")+ 
    		     "/mobile/flow/FlowForm/" + vmPath + ".vm";
    		if(logger.isDebugEnabled()){
    			logger.debug("viewPath:" + viewPath);
    		}
    		if(!new File(viewPath).exists()){
    			vmPath="通用/表单";
    		}
    		
    		//取得其对应的出口
    		List<Transition>trans=jbpmService.getTransitionsByTaskId(taskId.toString());
			for(Transition tran:trans){
				if(tran.getDestination()!=null){
					outTrans.add(new Transform(tran));					
				}
			}
    	}
		
		return "next";
	}
	
	//原系统的方法
	public String saveNext(){
		String signalName=getRequest().getParameter("signalName");	
		if(logger.isDebugEnabled()){
			logger.debug("taskId:" + taskId +  " signalName:" + signalName + " taskName:" + taskName);
		}
		
		FlowRunInfo flowRunInfo=getFlowRunInfo();
		processRunService.saveAndNextStep(flowRunInfo);
		return "list";
	}
	/**
	 * 启动,原系统的方法
	 * @return
	 */
	public String start(){
		ProDefinition systemProDef=proDefinitionService.get(defId);
		taskName=jbpmService.getStartNodeName(systemProDef);
		processName=systemProDef.getName();		
		vmPath=processName+ "/" + taskName;		
		String viewPath=getSession().getServletContext().getRealPath("") + "/mobile/flow/FlowForm/" + vmPath + ".vm";
		if(logger.isDebugEnabled()){
			logger.debug("viewPath:" + viewPath);
		}		
		if(!new File(viewPath).exists()){
			vmPath="通用/开始";
		}
		
		return "start";
	}
	
	public String saveStart(){
		FlowRunInfo flowRunInfo=getFlowRunInfo();
		ProcessRun processRun=initNewProcessRun();
		ProcessForm processForm=initNewProcessForm(processRun);
		processRunService.saveProcessRun(processRun, processForm,flowRunInfo);
		return "list";
	}
	
	protected Map<String, ParamField> constructFieldMap(){
		HttpServletRequest request=getRequest();
		
		//取得开始节点的任务名称
		if(StringUtils.isEmpty(taskName)){
			ProDefinition systemProDef=null;
			if(StringUtils.isNotEmpty(taskId)){
				ProcessDefinition pd=jbpmService.getProcessDefinitionByTaskId(taskId);
				systemProDef=proDefinitionService.getByDeployId(pd.getDeploymentId());
			}else{
				systemProDef=proDefinitionService.get(defId);
			}
			taskName=jbpmService.getStartNodeName(systemProDef);
			processName=systemProDef.getName();
		}else{
			if(StringUtils.isEmpty(processName)&& StringUtils.isNotEmpty(taskId)){
				ProcessDefinition pd=jbpmService.getProcessDefinitionByTaskId(taskId);
				ProDefinition systemProDef=proDefinitionService.getByDeployId(pd.getDeploymentId());
				processName=systemProDef.getName();
			}
		}
		//取得开始任务节点
		Map<String,ParamField> map=ProcessActivityAssistant.constructMobileFieldMap(processName, taskName);
		Iterator<String>fieldNames=map.keySet().iterator();
		while(fieldNames.hasNext()){
			String name=fieldNames.next();
			ParamField pf=map.get(name);
			//防止在Vm中通过.取不到值的问题，替换为_，如在提交表单时，
			//名称为arch.docName，在VM中取值将会变成arch_docName
			pf.setName(pf.getName().replace(".", "_"));
			pf.setValue(request.getParameter(name));			
			if(name.equals("archives.archivesId")){
				if(request.getAttribute("archives.archivesId")!=null){
					pf.setValue(request.getAttribute("archives.archivesId").toString());
				}
			}
		}
		return map;
	}
	
	/*
	 * 获取当前流程字段值
	 * add by hejianghai
	 */
	protected Map<String, ParamField> currentFieldMap(){
		HttpServletRequest request = getRequest();
		ProDefinition proDefinition = getProDefinition();
		// 取得开始节点的任务名称
		if (StringUtils.isEmpty(activityName)) {
			activityName = jbpmService.getStartNodeName(proDefinition);
		}
		// 取得开始任务节点
		Map<String, ParamField> map = ProcessActivityAssistant
				.constructFieldMap(proDefinition.getName(), activityName);

		Iterator<String> fieldNames = map.keySet().iterator();
		while (fieldNames.hasNext()) {
			String name = fieldNames.next();
			ParamField pf = map.get(name);
			// 防止在Vm中通过.取不到值的问题，替换为_，如在提交表单时，
			// 名称为arch.docName，在VM中取值将会变成arch_docName
			pf.setName(pf.getName().replace(".", "_"));
			pf.setValue(request.getParameter(name));
		}
		return map;
	}
	
	/**
	 * 取得流程定义
	 * 
	 * @return
	 */
	protected ProDefinition getProDefinition() {
		ProDefinition proDefinition = null;
		if (runId != null) {
			ProcessRun processRun = processRunService.get(runId);
			proDefinition = processRun.getProDefinition();
		} else if (defId != null) {
			proDefinition = proDefinitionService.get(defId);
		} else {// if(piId!=null){
			ProcessRun processRun = processRunService.getByTaskId(taskId
					.toString());
			proDefinition = processRun.getProDefinition();
		}
		return proDefinition;
	}
	
	
	/**
	 * 初始化一个新的流程
	 * @return
	 */
	protected ProcessRun initNewProcessRun(){
		ProDefinition proDefinition=proDefinitionService.get(defId);
		return processRunService.initNewProcessRun(proDefinition,null);
	}
	
	protected ProcessForm initNewProcessForm(ProcessRun processRun){
		ProcessForm processForm=new ProcessForm();
		processForm.setActivityName(taskName);
		processForm.setProcessRun(processRun);
		return processForm;
	}
	
	/**
	 * 取得流程运行的相关信息
	 */
	protected FlowRunInfo getFlowRunInfo() {
		FlowRunInfo info=new FlowRunInfo(getRequest());		
		Map<String, ParamField> fieldMap=constructFieldMap();
		info.setParamFields(fieldMap);
		return info;
	}
	
	/**
	 * 取得流程运行的相关信息
	 * add by hejianghai
	 */
	protected FlowRunInfo getCurrentFlowRunInfo() {
		FlowRunInfo info=new FlowRunInfo(getRequest());
		Map<String, ParamField> fieldMap=currentFieldMap();
		info.setParamFields(fieldMap);
		return info;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public Long getDefId() {
		return defId;
	}

	public void setDefId(Long defId) {
		this.defId = defId;
	}
	
	//cxt 20110712  点击待审批的公文进入各个公文的审批列表
	public  String getInnerGetFileNext(){
		currentUserIfOfficeManager = appUserService.isOfficeManager(ContextUtil.getCurrentUser());
		taskId=getRequest().getParameter("taskId");
		//Long archiveId=null;//cxt20110713
		if(StringUtils.isNotEmpty(taskId)){
			TaskImpl task=(TaskImpl)jbpmService.getTaskById(taskId);
			taskName=task.getName();
		    activityName=task.getActivityName();
    		ProcessDefinition pd=jbpmService.getProcessDefinitionByTaskId(taskId);
    		ProDefinition systemProDef=proDefinitionService.getByDeployId(pd.getDeploymentId());
    		processName=systemProDef.getName();  	
    		String taskNameTemp=taskName;
    		
			if("内部工作联系单收文".equals(processName)){				
				if("承办".equals(taskName.substring(0, 2))){
				taskNameTemp=taskName.substring(0, 7); 
    			taskName=taskName.substring(0, 7); 				
				}
			}			
			if("提交经营班子会议议题及材料审批表".equals(processName)){					
				if("相关".equals(taskName.substring(0, 2))){
				taskNameTemp=taskName.substring(0, 8); 
    			taskName=taskName.substring(0, 8); 				
				}
				if("室经".equals(taskName.substring(0, 2))){
					taskNameTemp=taskName.substring(0, 5); 
	    			taskName=taskName.substring(0, 5); 					
					}
			}	
			if("报运营会议材料审批_V1.0".equals(processName)){					
				if("相关".equals(taskName.substring(0, 2))){
				taskNameTemp=taskName.substring(0, 8); 
    			taskName=taskName.substring(0, 8); 				
				}
				if("室经".equals(taskName.substring(0, 2))){
					taskNameTemp=taskName.substring(0, 5); 
	    			taskName=taskName.substring(0, 5); 					
					}
				if(taskName.contains("分管领导审核")){
					taskNameTemp=taskName.substring(0, 6); 
	    			taskName=taskName.substring(0, 6); 				
				}
			}
			if("运营公司对外单位工作联系单_V1.0".equals(processName)){					
				if("部门分管".equals(taskName.substring(0, 4))){
				taskNameTemp=taskName.substring(0, 9); 
    			taskName=taskName.substring(0, 9); 				
				}				
			}
			if("运营公司报总公司上会材料审批_V1.0".equals(processName)){					
				if("相关部门".equals(taskName.substring(0, 4))){
				taskNameTemp=taskName.substring(0, 8); 
    			taskName=taskName.substring(0, 8); 				
				}
				if(taskName.contains("分管领导审核")){
					taskNameTemp=taskName.substring(0, 6); 
	    			taskName=taskName.substring(0, 6); 				
				}
			}
			if("运营公司外收文(内收文)".equals(processName)){
				if("承办".equals(taskName.substring(0, 2))){
					taskNameTemp=taskName.substring(0, 7); 
	    			taskName=taskName.substring(0, 7); 					
				}				
			}		
			
			if("红头文件".equals(processName)){					
				if(taskName.contains("相关部门部长意见")){
					taskNameTemp=taskName.substring(0, 8); 
	    			taskName=taskName.substring(0, 8); 				
				}
			}
			if("红头文件收文".equals(processName)){					
				if(taskName.contains("承办处理及回复")){
					taskNameTemp=taskName.substring(0, 7); 
	    			taskName=taskName.substring(0, 7); 				
				}
			}
			
			if("内部工作联系单收文_V1.0".equals(processName)){					
				if(taskName.contains("承办人收文处理")){
					taskNameTemp=taskName.substring(0, 7); 
	    			taskName=taskName.substring(0, 7); 
	    			System.out.println("---------------vmPath--443----------------"+taskNameTemp);
				}
			}
			
			if("运营公司外收文(内收文)_V1.0".equals(processName)){					
				if(taskName.contains("承办人收文处理")){
					taskNameTemp=taskName.substring(0, 7); 
	    			taskName=taskName.substring(0, 7); 
	    			System.out.println("---------------vmPath--441----------------"+taskNameTemp);
				}
			}
			if("会议纪要_V1.0".equals(processName)){					
				if(taskName.contains("相关部门部长意见")){
					taskNameTemp=taskName.substring(0, 8); 
	    			taskName=taskName.substring(0, 8); 	    			
				}
				if(taskName.contains("分管领导审核")){
					taskNameTemp=taskName.substring(0, 6); 
	    			taskName=taskName.substring(0, 6); 	    			
				}
			}	
			if("运营公司内发文_V1.0".equals(processName)){					
				if(taskName.contains("相关部门部长意见")){
					taskNameTemp=taskName.substring(0, 8); 
	    			taskName=taskName.substring(0, 8); 	    			
				}
				if(taskName.contains("分管领导审核")){
					taskNameTemp=taskName.substring(0, 6); 
	    			taskName=taskName.substring(0, 6); 	    			
				}
			}
			if("请示_V1.0".equals(processName)){					
				if(taskName.contains("相关部门部长意见")){
					taskNameTemp=taskName.substring(0, 8); 
	    			taskName=taskName.substring(0, 8); 	    			
				}
				if(taskName.contains("分管领导审核")){
					taskNameTemp=taskName.substring(0, 6); 
	    			taskName=taskName.substring(0, 6); 	    			
				}
			}if("运营公司外发文_V1.0".equals(processName)){					
				if(taskName.contains("相关部门部长意见")){
					taskNameTemp=taskName.substring(0, 8); 
	    			taskName=taskName.substring(0, 8); 	    			
				}
				if(taskName.contains("分管领导审核")){
					taskNameTemp=taskName.substring(0, 6); 
	    			taskName=taskName.substring(0, 6); 	    			
				}
			}
			if("红头文件收文_V1.0".equals(processName)){					
				if(taskName.contains("承办人收文处理")){
					taskNameTemp=taskName.substring(0, 7); 
	    			taskName=taskName.substring(0, 7); 	    			
				}			
					
			}			
			if("运营公司外收文(内收文)_V1.0".equals(processName)){					
				if(taskName.contains("承办人收文处理")){
					taskNameTemp=taskName.substring(0, 7); 
	    			taskName=taskName.substring(0, 7); 	    			
				}
			}	
    		vmPath=processName+ "/" + taskNameTemp;
    		String viewPath=getSession().getServletContext().getRealPath("")+ 
    		     "/mobile/flow/FlowForm/" + vmPath + ".vm";     
    		if(logger.isDebugEnabled()){
    			logger.debug("viewPath:" + viewPath);    		
    		}
    		System.out.println("---------------vmPath--444----------------"+vmPath);
    		if(!new File(viewPath).exists()){
    			vmPath="通用/表单";    			
    		}    		
    		//取得其对应的出口
    		List<Transition>trans=jbpmService.getTransitionsByTaskId(taskId.toString());
			for(Transition tran:trans){
				if(tran.getDestination()!=null){
					outTrans.add(new Transform(tran));					
				}
			}
    	}		
		// cxt 20110713 begin
				Map model = new HashMap();
				// 加上以前流程中的数据,显示当前任务的所有下一步的出口
				if (taskId != null) {
					ProcessRun processRun = processRunService.getByTaskId(taskId
							.toString());
					Map processRunVars = processFormService.getVariables(processRun
							.getRunId());

					if(processRunVars.get("archives_archivesId")!= null){
						archiveId =Long.parseLong((String)processRunVars.get("archives_archivesId")); //add by hejianghai
					}
					if(processRunVars.get("archives_issuerid") != null){
						archives_issuerid = Long.parseLong((String)processRunVars.get("archives_issuerid")); //add by hejianghai
					}
					if(processRunVars.get("assignUserId") != null){
						assignUserId = Long.parseLong((String)processRunVars.get("assignUserId")); //add by hejianghai
					}
					
					
					if(processRunVars.get("todepid")!=null){ //add by hejianghai
						todepid = (String)processRunVars.get("todepid");
					}
					
					// 准备表单的数据
					model.putAll(processRunVars);
					// 加上下一步的所有出口，为在VM文件中直接撰写跳转带来方便
					model.put(Constants.FLOW_NEXT_TRANS, outTrans);
					//filePath=archiveId
				}
				model.put("activityName", processName);
				model.put("currentUser", ContextUtil.getCurrentUser());
				model.put("dateTool", new DateTool());
				String formUiJs = "";
				if (StringUtils.isEmpty(formUiJs)) {
					formUiJs = "[]";
				}
				setJsonString(formUiJs);
				// cxt 20110713 end				
				if(!(("".equals(archiveId))||archiveId==null)){
					arch=archivesService.get(new Long(archiveId));	
					formatDate=sdf.format(arch.getCreatetime());
					Iterator it=arch.getArchivesDocs().iterator();
					int i=0;
					while( it.hasNext() ){
						ArchivesDoc  doc=	(ArchivesDoc) it.next();
						String filePath=doc.getFileAttach().getFilePath();
						String fileName=doc.getFileAttach().getFileName();
					//	filePaths.add(filePath);
						
			 String tempString="<a href=\""+ getRequest().getContextPath()+"/attachFiles/"+filePath+"\""+"  target="+"\""+"_blank"+"\""+">"+fileName+"</a>"+"|";
			 stringUrl+=tempString;
							}
					
					if("内部工作联系单".equals(processName)){						
						if("重新申请".equals(taskName)){
							 isOfficeManager=isOfficeManage();
							
							if (isOfficeManager == true) {
								isOfficeLeader2="yes";
							}else{
								isOfficeLeader2="no";
							}
						}
					
					}
					if("文件会签单".equals(processName)){
						if("室经理审核".equals(taskName)||"重新申请".equals(taskName)){
							isOfficeManager=false;
							isOfficeManager=appUserService.isOfficeManager(ContextUtil.getCurrentUser());
							if(isOfficeManager==true){						
								isOfficeLeader2="true";
							}
							else{							
								isOfficeLeader2="false";
							}						
						}
						
					}					
					
				if("文件会签收文".equals(processName)){
					isOfficeManager=isOfficeManage();
					
					if (isOfficeManager == true) {
						isOfficeLeader2="yes";
					}else{
						isOfficeLeader2="no";
					}					
				}
				Department curDep =ContextUtil.getCurrentUser().getDepartment();
				officeDepId=curDep.getDepId();//到所属的部门、室、工班
				curDep= departmentService.get3LevelDept(curDep);//获得部门id(第三级是部门)
				cruArchDepId=curDep.getDepId();
				cruArchDepName=curDep.getDepName();
				archives_issuerid=arch.getIssuerId();
				archives_issuer=arch.getIssuer();					
				}
				if(!stringUrl.equals("")){
					stringUrl = stringUrl.substring(0, stringUrl.lastIndexOf("|"));
				}
			processModel = model;			
			java.util.Date date = new java.util.Date();
			java.text.SimpleDateFormat format= new java.text.SimpleDateFormat("yyyy年MM月dd日 HH:mm", java.util.Locale.CHINA);
			footDateTime = format.format(date);			
		return "next";
	}

	/**
	 * 取得当前用户所在部门的主管
	 * 部门主管角色ID 23
	 * @return
	 */
	public void getLeadersAppUser(){
		AppUser currentUser = ContextUtil.getCurrentUser();
		Department curDep = currentUser.getDepartment();
		curDep = departmentService.get3LevelDept(curDep);
		Long roleID=new Long(23);
		List<AppUser> list = appUserService.findUserByDepandRole(roleID,curDep.getDepId());
		if (list.size() > 0) {
			for(int i=0;i<list.size();i++){
				getLeadersString+="<option   value= \""+list.get(i).getUserId()+"\" "+"  >"+ list.get(i).getFullname() +"</option> ";
				
	        }
		}
	}
	
	public void getOfficeLeader(){
		AppUser currentUser = ContextUtil.getCurrentUser();
		Department curDep = currentUser.getDepartment();
		curDep = departmentService.getDeptByLevel(curDep,4);
		Long roleID=new Long(64);
		List<AppUser> list = appUserService.findUserByDepandRole(roleID,curDep.getDepId());
		if(list.size()>0){
			for(int i=0;i<list.size();i++){
				getLeadersString+="<option   value= \""+list.get(i).getUserId()+"\" "+"  >"+ list.get(i).getFullname() +"</option> ";
		    }
		}
	}
	
	/**
	 * 获取公司收发文负责人
	 * 公司收发文负责人 29
	 */
	public void getSeRePer(){
		Long roleID=new Long(29);
		List<AppUser> list = appUserService.findByRoleId(roleID);
		if(list.size()>0){
			
			flowAssignId2=list.get(0).getUserId();
			
		}
	}	

	/**
	 * 获取所有部门的id以及名称，拼出下拉框
	 * @return
	 */
	public String getDepartmentFunc(){
		List<Department> listParent;
		listParent=departmentService.findByParentId(new Long(0));//最顶层父节点
		for(int i=0;i<listParent.size();i++){
		getDepartments+="<option value="+"\""+listParent.get(i).getDepId()+"\""+">"+listParent.get(i).getDepName()+
		"</option>";
		}		
		return getDepartments;
	}
	
	/* ---------通知 start-------- */
	private void notice(ProcessInstance pi, String userId, String piId) {
		// 取得这些任务的下一步的相关参与人员，并且根据页面提交的设置决定是否发送短信及邮件
		if (pi != null) {
			List<Task> taskList = jbpmService.getTasksByPiId(pi.getId());

			for (Task task : taskList) {
				TaskImpl taskImpl = (TaskImpl) task;
				if (taskImpl.getAssignee() == null) {
					Iterator<ParticipationImpl> partIt = taskImpl
							.getAllParticipants().iterator();
					while (partIt.hasNext()) {
						ParticipationImpl part = partIt.next();
						if (part.getGroupId() != null
								&& StringUtil.isNum(part.getGroupId())) {
							// 发送邮件
							List<AppUser> appUserList = appUserService.findByRoleId(new Long(part.getGroupId()));
							for (AppUser user : appUserList) {
								sendMailNotice(taskImpl, user);
							}
						} else if (part.getUserId() != null
								&& StringUtil.isNum(part.getUserId())) {
							AppUser appUser = appUserService.get(new Long(part
									.getUserId()));
							sendMailNotice(taskImpl, appUser);
						}
					}
				} else if (StringUtil.isNum(taskImpl.getAssignee())) {
					AppUser appUser = appUserService.get(new Long(taskImpl
							.getAssignee()));
					sendMailNotice(taskImpl, appUser);
				}
			}
		} else {
			if (StringUtils.isNotEmpty(userId) && StringUtils.isNotEmpty(piId)) {
				AppUser appUser = appUserService.get(Long.valueOf(userId));
				ProDefinition proDefinition = proDefinitionService.get(Long
						.valueOf(piId));
				sendNotice(proDefinition, appUser);
			}
		}
	}

	/**
	 * 发送邮件及短信通知
	 * 
	 * @param task
	 * @param appUser
	 */
	private void sendMailNotice(Task task, AppUser appUser) {
		String sendMail = getRequest().getParameter("sendMail");
		String sendMsg = getRequest().getParameter("sendMsg");
		Date curDate = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String curDateStr = sdf.format(curDate);
		if ("true".equals(sendMail)) {
			// 发送邮件
			if (appUser.getEmail() != null) {
				if (logger.isDebugEnabled()) {
					logger.info("Notice " + appUser.getFullname() + " by mail:"
							+ appUser.getEmail());
				}

				String tempPath = "mail/flowMail.vm";
				Map model = new HashMap();
				model.put("curDateStr", curDateStr);
				model.put("appUser", appUser);
				model.put("task", task);
				String subject = "来自" + AppUtil.getCompanyName() + "办公系统的待办任务("
						+ task.getName() + ")提醒";
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { appUser.getEmail() }, null, null, null,
						null, true);
			}
		}
		if ("true".equals(sendMsg)) {
			// 发送手机短信
			if (appUser.getMobile() != null) {
				if (logger.isDebugEnabled()) {
					logger.info("Notice " + appUser.getFullname()
							+ " by mobile:" + appUser.getMobile());
				}

				String content = AppUtil.getCompanyName() + "办公系统于"
						+ curDateStr + "产生了一项待办事项(" + task.getName()
						+ ")，请您在规定时间内完成审批~";
				/*
				 * MobileMsg mobileMsg=new MobileMsg();
				 * mobileMsg.setContent(content);
				 * mobileMsg.setMobileNo(appUser.getMobile());
				 * mobileMsg.setCreatetime(curDate);
				 * mobileMsg.setStatus(MobileMsg.STATUS_INIT);
				 * mobileMsgService.save(mobileMsg);
				 */
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),
						content);
			}
		}
	}

	/**
	 * 
	 * 流程最后一步发送邮件和短信通知
	 * 
	 * @param task
	 * @param appUser
	 */
	private void sendNotice(ProDefinition proDefinition, AppUser appUser) {
		String sendMail = getRequest().getParameter("sendMail");
		String sendMsg = getRequest().getParameter("sendMsg");

		Date curDate = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String curDateStr = sdf.format(curDate);
		if ("true".equals(sendMail)) {
			// 发送邮件
			if (appUser.getEmail() != null) {
				if (logger.isDebugEnabled()) {
					logger.info("Notice " + appUser.getFullname() + " by mail:"
							+ appUser.getEmail());
				}
				String tempPath = "mail/mailNotice.vm";
				Map model = new HashMap();
				model.put("curDateStr", curDateStr);
				model.put("defName", proDefinition.getName());
				String subject = "来自" + AppUtil.getCompanyName() + "办公系统的待办任务("
						+ proDefinition.getName() + ")提醒";
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { appUser.getEmail() }, null, null, null,
						null, true);

			}
		}
		if ("true".equals(sendMsg)) {
			// 发送手机短信
			if (appUser.getMobile() != null) {
				if (logger.isDebugEnabled()) {
					logger.info("Notice " + appUser.getFullname()
							+ " by mobile:" + appUser.getMobile());
				}

				String content = AppUtil.getCompanyName() + "办公管理系统于"
						+ curDateStr + "审核完成您发起的" + proDefinition.getName();
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),
						content);
			}
		}
	}

	/**
	 * 根据部门ID获得部门综合管理员
	 * 部门综合管理员角色ID 24
	 * @return
	 */
	public List<AppUser> getInterManager(){
		String dids[]=todepid.split(",");
		List<AppUser> list=new ArrayList();
		Long roleID=new Long(24);
		for(String did:dids){
		List<AppUser> li= appUserService.findUserByDepandRole(roleID, new Long(did));
		list.addAll(li);
		}
		return list;
	}
	
	/**
	 * 按部门查找部门人员
	 * @return
	 */
	
	public String selectAppUser(){
		String gettemp="";
		PagingBean pb = new PagingBean(0, 99999);
		Department curDep =ContextUtil.getCurrentUser().getDepartment();
		curDep= departmentService.get3LevelDept(curDep);		
		// 表示从上级目录开始进行查找
		String path = "0.";
		AppUser	appUser = ContextUtil.getCurrentUser();
		if( !((curDep.getDepId()==null)&&("".equals(curDep.getDepId())))) {
			Long depId = curDep.getDepId();
			Department dep = departmentService.get(depId);
			if (dep != null) {
				path = dep.getPath();
			}
		} else {
			Department dep = appUser.getDepartment();
			if (dep != null) {
				path = dep.getPath();
			}
		}
		List<AppUser> list = appUserService.findByDepartment(path, pb);
		
		for(AppUser user:list){
			gettemp+="<option   value= \""+user.getUserId()+"\" "+"  >"+ user.getFullname()+"("+user.getUsername()+")" +"</option> ";
	 
		}
		return 	gettemp;
		
	}
	/**
	 * 获取所有科室，拼出下拉框
	 * @return
	 */
	public String getDepartmentNext(){
		List<Department> listParent;
		listParent=departmentService.findByParentId(new Long(0));//最顶层父节点
		for(int i=0;i<listParent.size();i++){			
				//buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
			  
			getDepartments+=findChild(listParent.get(i).getDepId());		
		}		
		return getDepartments;
	}	
	
	/*
	 * 寻找子根节点*/	
	public String findChild(Long depId){	
		List<Department> list=departmentService.findByParentId(depId);
		if(list.size()==0){			
			return ""; 
		}else {			
			for(Department dep2:list){				
				getDepartments+="<option value="+"\""+dep2.getDepId()+"\""+">"+dep2.getDepName()+
				"</option>";
				findChild(dep2.getDepId());
			}			
			return getDepartments;
		}
	}
	
	/**
	 * 获取所有的部门
	 * @return
	 */
	public String getAllDpt(){		
		List<Department> listParent;
		listParent=departmentService.findByParentId(new Long(1));//1为部门节点
		if(listParent.size()==0){			
			return ""; 
		}else {			
			for(Department dep2:listParent){				
				getDepartments+="<option value="+"\""+dep2.getDepId()+"\""+">"+dep2.getDepName()+
				"</option>";
				findChild(dep2.getDepId());
			}			
			return getDepartments;
		}
		
	}
	/**
	 * 获取抄送人员，拼字符串
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getShaoSong(){
		PagingBean pb=new PagingBean(0, 99999);
		isOfficeManager=isOfficeManage();
		Long roleId;
		if(isOfficeManager==true){
			roleId=new Long(23);			
		}
		else{
			roleId=new Long(64);	
		}	
		
		// 表示从上级目录开始进行查找
		String path = "0.";	
	
		if (!((cruArchDepId==null)&&("".equals(cruArchDepId))) ){
			Department curDep =ContextUtil.getCurrentUser().getDepartment();
			curDep= departmentService.get3LevelDept(curDep);
			if (curDep == null) {// 若所属部门为空，则设置一个缺省的部门 TODO
				curDep = new Department();
				curDep.setDepId(0l);
				curDep.setDepName(AppUtil.getCompanyName());
			}			
			Long depId=curDep.getDepId();
			Department dep = departmentService.get(depId);
			if (dep != null) {
				path = dep.getPath();
			}
		} else {
			Department dep = ContextUtil.getCurrentUser().getDepartment();
			if (dep != null) {
				path = dep.getPath();
			}
		}

		List<AppUser> list = appUserService.selectByDepAndRole(path, pb,roleId);
	for(AppUser app:list){
		
		shaoSongString+="<option value="+"\""+app.getUserId()+"\""+">"+app.getFullname()+
		"</option>";
	}
		
		return shaoSongString;
				
	}
	/**
	 * 判断是否是室经理
	 * @return
	 */
	
	public boolean isOfficeManage(){			
	isOfficeManager=false;
		isOfficeManager=appUserService.isOfficeManager(ContextUtil.getCurrentUser());	
		return  isOfficeManager;
	}	

	
	/* ---------页面属性值 start-------- */
	private String todepid;
	private Long archivesId;
	private Long archives_issuerid;
	private Long reFlowAssignId;	
	private Long assignUserId;
	private boolean currentUserIfOfficeManager;
	private Map processModel;
	private String footDateTime;	
	
	public String getFootDateTime() {
		return footDateTime;
	}
	public void setFootDateTime(String footDateTime) {
		this.footDateTime = footDateTime;
	}
	public Map getProcessModel() {
		return processModel;
	}
	public void setProcessModel(Map processModel) {
		this.processModel = processModel;
	}
	public boolean isCurrentUserIfOfficeManager() {
		return currentUserIfOfficeManager;
	}
	public void setCurrentUserIfOfficeManager(boolean currentUserIfOfficeManager) {
		this.currentUserIfOfficeManager = currentUserIfOfficeManager;
	}
	
	public Long getAssignUserId() {
		return assignUserId;
	}
	public void setAssignUserId(Long assignUserId) {
		this.assignUserId = assignUserId;
	}
	public Long getReFlowAssignId() {
		return reFlowAssignId;
	}
	public void setReFlowAssignId(Long reFlowAssignId) {
		this.reFlowAssignId = reFlowAssignId;
	}
	public Long getArchives_issuerid() {
		return archives_issuerid;
	}
	public void setArchives_issuerid(Long archivesIssuerid) {
		archives_issuerid = archivesIssuerid;
	}
	public String getTodepid() {
		return todepid;
	}
	public void setTodepid(String todepid) {
		this.todepid = todepid;
	}
	public Long getArchivesId() {
		return archivesId;
	}

	public void setArchivesId(Long archivesId) {
		this.archivesId = archivesId;
	}	
	
}
