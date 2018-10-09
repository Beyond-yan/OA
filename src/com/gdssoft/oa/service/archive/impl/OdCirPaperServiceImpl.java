package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.gdssoft.core.Constants;
import com.gdssoft.core.jbpm.pv.ParamField;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.action.flow.ProcessActivityAssistant;
import com.gdssoft.oa.dao.archive.OdCirPaperDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.OdCirPaper;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.OdCirPaperService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProcessRunService;

public class OdCirPaperServiceImpl extends BaseServiceImpl<OdCirPaper> implements OdCirPaperService{
	
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private ProcessRunService processRunService;
	@SuppressWarnings("unused")
	private OdCirPaperDao dao;
	
	public OdCirPaperServiceImpl(OdCirPaperDao dao) {
		super(dao);
		this.dao=dao;
	}

	/**
	 * 启动子流程
	 * @param defId
	 * @param archives
	 * @param processName
	 * @param activityName
	 * @param flowAssignIds
	 * @param createUser 子流程发起人
	 * @return
	 */
	public String startCirSubFlow(Long defId,OdCirPaper odCirPaper,String processName,String activityName,String signUserIds,AppUser createUser){
		String runId = "";
		try {
			Map<String,ParamField> fieldMap=constructStartFlowMap(odCirPaper,signUserIds,defId,processName,activityName);
			
			ProDefinition proDefintion=proDefinitionService.get(defId);
			if(proDefintion!=null){
				ProcessRun processRun=processRunService.initNewSubProcessRun(proDefintion,createUser);
				//流程的启动表单信息
				ProcessForm processForm=new ProcessForm();
				processForm.setActivityName(activityName);
				processForm.setProcessRun(processRun);
				
				//流程启动的信息
				FlowRunInfo runInfo=new FlowRunInfo();
				runInfo.setParamFields(fieldMap);
				runInfo.setMultipleTask(signUserIds);
				runInfo.setStartFlow(true);
				Map variables = runInfo.getVariables();
				System.out.println("------Constants.FLOW_SIGN_USERIDS------OdCirPaperServiceImpl----"+(String) variables
						.get(Constants.FLOW_SIGN_USERIDS));
				//启动流程
				runId = processRunService.saveSubProcessRun(processRun, processForm,runInfo,createUser);
				System.out.println("-------runId------" +runId);
			}
			return runId;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	protected Map<String, ParamField> constructStartFlowMap(OdCirPaper odCirPaper,String signUserIds2,Long defId,String processName,String activityName){

		Map<String,ParamField> map=ProcessActivityAssistant.constructFieldMap(processName, activityName);
		
		ParamField cirPaperId=map.get("odCirPaper.cirPaperId");
		if(cirPaperId!=null){
			cirPaperId.setName(cirPaperId.getName().replace(".", "_"));
			cirPaperId.setValue(String.valueOf(odCirPaper.getCirPaperId()));
			System.out.println("-------odCirPaper.getCirPaperId()------" + odCirPaper.getCirPaperId());
		}
		//发文人id
		ParamField signUserIds=map.get("signUserIds");
		if(signUserIds!=null){
			signUserIds.setValue(signUserIds2);
		}
		return map;
	}

	@Override
	public List<OdCirPaper> searchBySender(Long senderUserId, String subject,
			String senderName, String recName, String isRead, PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.searchBySender(senderUserId, subject, senderName, recName, isRead, pb);
	}
}