package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.OdCirPaper;
import com.gdssoft.oa.model.archive.OdCirUser;
import com.gdssoft.oa.model.archive.OdFlowtype;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.archive.OdCirPaperService;
import com.gdssoft.oa.service.archive.OdCirUserService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class OdCirPaperAction extends BaseAction{
	@Resource
	private OdCirPaperService odCirPaperService;
	
	@Resource
	private FileAttachService fileAttachService;
	
	
	
	@Resource
	private OdCirUserService odCirUserService;
	
	@Resource
	private ProcessRunService processRunService;
	private OdCirPaper odCirPaper;
	
	private Long cirPaperId;

	public Long getCirPaperId() {
		return cirPaperId;
	}

	public void setCirPaperId(Long cirPaperId) {
		this.cirPaperId = cirPaperId;
	}

	public OdCirPaper getOdCirPaper() {
		return odCirPaper;
	}

	public void setOdCirPaper(OdCirPaper odCirPaper) {
		this.odCirPaper = odCirPaper;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<OdCirPaper> list= odCirPaperService.getAll(filter);
		
		Type type=new TypeToken<List<OdCirPaper>>(){}.getType();
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
				odCirPaperService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 查看附件文档
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getFiles(){
		StringBuffer sb = new StringBuffer("{success:true,totalCounts:");
		String cirPaperID = getRequest().getParameter("cirPaperId");
		Long cirPaperId=new Long(cirPaperID);
		if (cirPaperId != null) {
			OdCirPaper odCirPaper=odCirPaperService.get(cirPaperId);
			Set odCirFiles =odCirPaper.getOdCirFiles();
			List docList = new ArrayList();
			docList.addAll(odCirFiles);
			Type type = new TypeToken<List<FileAttach>>() {
			}.getType();
			sb.append(odCirFiles.size());
			sb.append(",results:").append(new Gson().toJson(docList, type));
		} else {
			sb.append("0,results:[]");
		}
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		OdCirPaper odCirPaper=odCirPaperService.get(cirPaperId);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(odCirPaper));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	@SuppressWarnings("unchecked")
	public String save(){
		String docIds = getRequest().getParameter("docIds");
		String recIds = getRequest().getParameter("recIds");
		AppUser currentUser = ContextUtil.getCurrentUser();
		String [] recs=recIds.split(",");
		String [] files=docIds.split(",");
		Set odCirFilesSet = new HashSet();
		if(files.length>0){
			for(String fileId:files){
				FileAttach fileAttach=fileAttachService.get(new Long(fileId));
				odCirFilesSet.add(fileAttach);
			}
		}
		odCirPaper.setOdCirFiles(odCirFilesSet);
		OdCirPaper newOdCirPaper=new OdCirPaper();
		if(odCirPaper.getCirPaperId()==null){
			newOdCirPaper=odCirPaperService.save(odCirPaper);
			for(String recUserId:recs){
				OdCirUser odCirUser=new OdCirUser();
				odCirUser.setSendUserId(currentUser.getUserId());
				odCirUser.setRecUserId(new Long(recUserId));
				odCirUser.setOdCirPaper(newOdCirPaper);
				odCirUser.setIsRead((short) 0);
				odCirUser=odCirUserService.save(odCirUser);
				odCirUser.setPath(odCirUser.getCirUserId().toString()+".");
				odCirUserService.save(odCirUser);
			}
		}else{
			OdCirPaper orgOdCirPaper=odCirPaperService.get(odCirPaper.getCirPaperId());
			try{
				BeanUtil.copyNotNullProperties(orgOdCirPaper, odCirPaper);
				newOdCirPaper=odCirPaperService.save(orgOdCirPaper);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true,cirPaperId:'" + newOdCirPaper.getCirPaperId()
				+ "'}");
		return SUCCESS;
	}
	
	
	/**
	 * 更新流程实例ID
	 */
	public String updateRunId(){
		String runId = getRequest().getParameter("runId");
		String cirPaperId = getRequest().getParameter("cirPaperId");
		OdCirPaper odCirPaper=odCirPaperService.get(new Long(cirPaperId));
		ProcessRun processRun=processRunService.get(new Long(runId));
		List<OdCirUser> cirUserList=odCirUserService.getListByCirPaperId(new Long(cirPaperId));
		for(OdCirUser ocu:cirUserList){
			ocu.setProcessRun(processRun);
			odCirUserService.save(ocu);
		}
		processRun.setSubject(odCirPaper.getSubject());
		processRunService.save(processRun);
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	
	
}
