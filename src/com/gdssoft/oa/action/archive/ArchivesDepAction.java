package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.mail.internet.MimeUtility;  
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import com.gdssoft.core.engine.MailEngine;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDep;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.archive.ArchivesDepService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class ArchivesDepAction extends BaseAction{
	private static final Set<ArchivesDep> ArchivesDep = null;
	@Resource
	private ArchivesDepService archivesDepService;
	private ArchivesDep archivesDep;
	@Resource
	private MailEngine mailEngine;
	@Resource
	private DepartmentService departmentService;
	@Resource
	private ArchivesService archivesService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private SmsMobileService smsMobileServie;
	
	private Long archDepId;

	public ArchivesService getArchivesService() {
		return archivesService;
	}

	public void setArchivesService(ArchivesService archivesService) {
		this.archivesService = archivesService;
	}

	public ArchivesDepService getArchivesDepService() {
		return archivesDepService;
	}

	public void setArchivesDepService(ArchivesDepService archivesDepService) {
		this.archivesDepService = archivesDepService;
	}

	public DepartmentService getDepartmentService() {
		return departmentService;
	}

	public void setDepartmentService(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}

	public Long getArchDepId() {
		return archDepId;
	}

	public void setArchDepId(Long archDepId) {
		this.archDepId = archDepId;
	}

	public ArchivesDep getArchivesDep() {
		return archivesDep;
	}

	public void setArchivesDep(ArchivesDep archivesDep) {
		this.archivesDep = archivesDep;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		String searchType=getRequest().getParameter("searchType");
		QueryFilter filter=new QueryFilter(getRequest());
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String signTime = getRequest().getParameter("Q_signTime_D_GE");
		String creatime = getRequest().getParameter("Q_createTime_D_GE");
		if(StringUtils.isNotBlank(signTime)){
			try {
				Date sgTime=formatter.parse(signTime);
				Calendar cl = Calendar.getInstance();
				cl.setTime(sgTime);
				cl.add(cl.DATE, 1);
				filter.addFilter("Q_signTime_D_LT",formatter.format(cl.getTime()));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if(StringUtils.isNotBlank(creatime)){
			try {
				Date createTime=formatter.parse(creatime);
				Calendar cl = Calendar.getInstance();
				cl.setTime(createTime);
				cl.add(cl.DATE, 1);
				filter.addFilter("Q_createTime_D_LT",formatter.format(cl.getTime()));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if(searchType.equals("receive")||searchType=="receive"){
			AppUser curUser=ContextUtil.getCurrentUser();
			Department curDep=curUser.getDepartment();
			Department dep=departmentService.get3LevelDept(curDep);
			//显示当前用户所在部门的公文签收列表
			filter.addFilter("Q_department.depId_L_EQ", dep.getDepId().toString());
		}else if(searchType.equals("moniter")||searchType=="moniter"){
			String archivesId=getRequest().getParameter("archivesId");
			filter.addFilter("Q_archives.archivesId_L_EQ",archivesId);
		}
		List<ArchivesDep> list= archivesDepService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer json = JsonUtil.getJSONSerializer("archives.createtime");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "signTime");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "createTime");
		buff.append(json.serialize(list));

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
				archivesDepService.remove(new Long(id));
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
		ArchivesDep archivesDep=archivesDepService.get(archDepId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(archivesDep));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String depIds = getRequest().getParameter("depIds");
		String sentUserIds = getRequest().getParameter("sentUserIds");
		String archivesId = getRequest().getParameter("archivesId");
		Archives arch=archivesService.get(Long.valueOf(archivesId));
		AppUser currentUser = ContextUtil.getCurrentUser();
		List<ArchivesDep> list=null;
		if(depIds!=null&&StringUtils.isNotEmpty(depIds)){
			String[] ids = depIds.split(",");
			if(StringUtils.isNotEmpty(archivesId)&&archivesId!=null){
				QueryFilter filter=new QueryFilter(getRequest());
				filter.addFilter("Q_archives.archivesId_L_EQ", archivesId);
				filter.addFilter("Q_sentType_SN_EQ", "1");
				list=archivesDepService.getAll(filter);
			}
			Archives archives=archivesService.get(Long.valueOf(archivesId));
			for(String id:ids){
				if(null!=id&&!"".equals(id)){
					if(list!=null&&list.size()>0){
						for(ArchivesDep archDep:list){
							archivesDepService.remove(archDep);
						}
					}
					Department depart=departmentService.get(Long.valueOf(id));
					if(depart!=null&&depart.getDepLevel()==2
							&& depart.getDepId() != 100130){ // 委机关直接发送到委机关){
						List<Department> departList=departmentService.findByParentId(depart.getDepId());
						for(Department department:departList){
							ArchivesDep archivesDep=new ArchivesDep();
							archivesDep.setArchives(archives);
							archivesDep.setDepartment(department);					
							archivesDep.setSubject("  ");
							archivesDep.setStatus((short) 0);
							archivesDep.setIsMain((short)0);
							archivesDep.setCreateTime(new Date());
							archivesDep.setCreateUserId(currentUser.getUserId());
							archivesDep.setCreateUserName(currentUser.getUsername());
							archivesDep.setSentType((short) 1);
							archivesDepService.save(archivesDep); 
						}
					}else{
						ArchivesDep archivesDep=new ArchivesDep();
						archivesDep.setArchives(archives);
						archivesDep.setDepartment(departmentService.get(Long.valueOf(id)));					
						archivesDep.setSubject("  ");
						archivesDep.setStatus((short) 0);
						archivesDep.setIsMain((short)0);
						archivesDep.setCreateUserId(currentUser.getUserId());
						archivesDep.setCreateUserName(currentUser.getUsername());
						archivesDep.setCreateTime(new Date());
						archivesDep.setSentType((short) 1);
						archivesDepService.save(archivesDep);  
					}
					if(depart.getPath().indexOf("0.100130.")==-1){//排除委机关
						List<AppUser> auList=appUserService.getAppUserRoleByDepId(depart.getDepId()+"","1264102,2454491");
						for(AppUser appUser : auList){
							if(appUser.getMobile()!=null){
								String subject = "温馨提醒：您有一篇新公文("+arch.getSubject()+") ，请及时到OA系统中下载!";
								SmsMobile smsInner = new SmsMobile();
								smsInner.setPhoneNumber(appUser.getMobile());
								smsInner.setRecipients(appUser.getFullname());
								smsInner.setRecipientsId(appUser);
								smsInner.setSendTime(new Date());
								smsInner.setSmsContent(subject);
								smsInner.setUserId(ContextUtil.getCurrentUserId());
								smsInner.setUserName(ContextUtil.getCurrentUser().getFullname());
								smsInner.setStatus(SmsMobile.STATUS_NOT_SENDED);
								smsMobileServie.save(smsInner);
							}
						}
					}
				}
			}
		}
		if(sentUserIds!=null&&StringUtils.isNotEmpty(sentUserIds)){
			String[] userIds = sentUserIds.split(",");
			QueryFilter filter=new QueryFilter(getRequest());
			filter.addFilter("Q_archives.archivesId_L_EQ", archivesId);
			filter.addFilter("Q_sentType_SN_EQ", "2");
			list=archivesDepService.getAll(filter);
			for(String userId:userIds){
				if(list!=null&&list.size()>0){
					for(ArchivesDep archDep:list){
						archivesDepService.remove(archDep);
					}
				}
				AppUser appUser=appUserService.get(new Long(userId));
				ArchivesDep archivesDep=new ArchivesDep();
				archivesDep.setArchives(arch);
				archivesDep.setDepartment(appUser.getDepartment());				
				archivesDep.setSubject("  ");
				archivesDep.setStatus((short) 0);
				archivesDep.setIsMain((short)0);
				archivesDep.setSignUserID(new Long(userId));
				archivesDep.setSignFullname(appUser.getUsername());
				archivesDep.setCreateUserId(currentUser.getUserId());
				archivesDep.setCreateUserName(currentUser.getUsername());
				archivesDep.setCreateTime(new Date());
				archivesDep.setSentType((short) 2);
				archivesDepService.save(archivesDep); 
				/*公文发送之后默认发送短信*/
				if(appUser.getMobile()!=null){
					String subject = "温馨提醒：您有一篇新公文("+arch.getSubject()+") ，请及时到OA系统【单位公文收发下个人公文下载里下载】中下载!";
					SmsMobile smsInner = new SmsMobile();
					smsInner.setPhoneNumber(appUser.getMobile());
					smsInner.setRecipients(appUser.getFullname());
					smsInner.setRecipientsId(appUser);
					smsInner.setSendTime(new Date());
					smsInner.setSmsContent(subject);
					smsInner.setUserId(ContextUtil.getCurrentUserId());
					smsInner.setUserName(ContextUtil.getCurrentUser().getFullname());
					smsInner.setStatus(SmsMobile.STATUS_NOT_SENDED);
					smsMobileServie.save(smsInner);
				}	
			}
			
		}
		/*公文分发发送邮件*/
		String emailUserIds = getRequest().getParameter("emailUserIds");
		if(null!=emailUserIds&&!"".equals(emailUserIds)){
		Archives archives=archivesService.get(Long.valueOf(archivesId));
		String comment=archives.getSubject();
		String attachedFileNames=null;
	    String fPath = null;
	    ArrayList<File> fileattaches=new ArrayList<File>();
	    ArrayList<String> filename=new ArrayList<String>();
	    File[] files = null;
	    String[] name=null;
		Set<ArchivesDoc> archivesdoc=archives.getArchivesDocs();
		for (ArchivesDoc archivesss : archivesdoc) {
			/*获取附件路径*/
		      fPath ="attachFiles/"+archivesss.getDocPath();
		      /*获取附件名称*/
		      attachedFileNames=archivesss.getDocName();
/*		      附件名称进行utf-8编码*/
		      String attachedFileNames2=attachedFileNames.toString();
		      try {
				filename.add(MimeUtility.encodeWord(attachedFileNames2));
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		      /*把名称和附件都转换为数组因为发送邮件附件传递的是数组形式的*/
		      final int size1 =  filename.size();
		      name = (String[])filename.toArray(new String[size1]);
		      File dir = new File(getSession().getServletContext().getRealPath(fPath));
		      fileattaches.add(dir);
		      final int size2 =  fileattaches.size();
		      files = (File[])fileattaches.toArray(new File[size2]);
			}
		/*调用发送邮件接口*/
		email(emailUserIds,comment,name,files);}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	/**
	 * 发送邮件
	 * 
	 * @return
	 */
	@SuppressWarnings("unused")
	private String email(String signdepIds, String comment,String[] attachedFileNames,File[] files){
		SimpleDateFormat sdfmail = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		Date curDate = new Date();
		String curDateStr = sdfmail.format(curDate);
		// 发送邮件
		String userIds=signdepIds;
		String[] signids = userIds.split(",");
		File[] file=null;
		String[] name=null;
		for (String userid:signids){
			AppUser	appuser=appUserService.get(Long.valueOf(userid));
			QueryFilter filter = new QueryFilter(getRequest());
			filter.addFilter("Q_userId_L_EQ",userid);
			List<AppUser> list2=appUserService.getAll(filter);
			 for(AppUser au:list2){
			if (au.getEmail() != null) {
				if (logger.isDebugEnabled()) {
					logger.info("Notice " + au.getFullname() + " by mail:"
							+ au.getEmail());
				}
				String tempPath = "mail/emailout.vm";
				Map model = new HashMap();
				model.put("curDateStr", curDateStr);
				String subject = comment;
				if(null!=files)
				file=files;
				if(null!=attachedFileNames)
				 name=attachedFileNames;
				model.put("appUser", au);
				System.out.println("---subject---"+subject);
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { au.getEmail() }, null, null, name,
						file, false);
			}
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}
	public String handleBack(){
		String archDepId = getRequest().getParameter("archDepId");
		String content = getRequest().getParameter("content");
		ArchivesDep ad=archivesDepService.get(new Long(archDepId));
		ad.setHandleFeedback(content);
		archivesDepService.save(ad);
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String notice(){
		AppUser currentUser = ContextUtil.getCurrentUser();
		String archDepId = getRequest().getParameter("archDepId");
		String sourceType = getRequest().getParameter("sourceType");
		String down = getRequest().getParameter("download");
		String content = getRequest().getParameter("content");
		List<AppUser> auList = new ArrayList<AppUser>();
		if(down.equals("down")){
			if(sourceType!=null&&"2".equals(sourceType)){
				AppUser appUser=appUserService.findByUserName(archDepId);
				auList.add(appUser);
			}else{
				auList=appUserService.findUserByDepandRole(1264102L,new Long(archDepId));
			}
		}else{
			if(sourceType!=null&&"2".equals(sourceType)){
				AppUser appUser=appUserService.findByUserName(archDepId);
				auList.add(appUser);
			}else{
				ArchivesDep ad=archivesDepService.get(new Long(archDepId));
				auList=appUserService.findUserByDepandRole(1264102L,ad.getDepartment().getDepId());
			}
		}
		for(AppUser au:auList){
			if(au.getMobile()!=null&&au.getMobile()!=""){
				SmsMobile sm=new SmsMobile();
				sm.setPhoneNumber(au.getMobile());
				sm.setRecipients(au.getFullname());
				sm.setRecipientsId(au);
				sm.setSendTime(new Date());
				sm.setSmsContent(content);
				sm.setStatus((short) 0);
				sm.setUserId(currentUser.getUserId());
				sm.setUserName(currentUser.getUsername());
				smsMobileServie.save(sm);
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	/**
	 * 根据archiveId查找部门id
	 */
	public String selectByArchiveId(){
		QueryFilter filter=new QueryFilter(getRequest());
		String archiveId=getRequest().getParameter("archiveId");
		StringBuffer buffer=new StringBuffer("[");
		filter.getPagingBean().setPageSize(Integer.MAX_VALUE);
		if(archiveId!=null&&!archiveId.equals("")){
			filter.addFilter("Q_archives.archivesId_L_EQ", archiveId);
			
		}
		List<ArchivesDep> list=archivesDepService.getAll(filter);
		for(ArchivesDep archivesDep:list){
			//if(buffer.indexOf(archivesDep.getDepId()+"")==-1 ){
				if(archivesDep.getSentType()!=null&&archivesDep.getSentType()==2){
					AppUser app=appUserService.findByUserName(archivesDep.getSignFullname());
					if(app!=null){
						buffer.append("[\"");
						buffer.append(archivesDep.getSignUserID()).append("\",");
						buffer.append("\"");
						buffer.append(app.getFullname()).append("\",\"2\"],");
					}
				}else{
					buffer.append("[\"");
					buffer.append(archivesDep.getDepId()).append("\",");
					buffer.append("\"");
					buffer.append(departmentService.get(archivesDep.getDepId()).getDepName()).append("\",\"1\"],");
				}
			//}
		}
		if(list.size()>0){
			buffer.deleteCharAt(buffer.length()-1);
		}
		buffer.append("]");
		setJsonString(buffer.toString());
		return SUCCESS;
	}
	
	/**
	 * 显示待下载公文列表
	 * 
	 */
	public String display(){
		QueryFilter filter=new QueryFilter(getRequest());
		AppUser curUser=ContextUtil.getCurrentUser();
		Department curDep=curUser.getDepartment();
		Department dep=departmentService.get3LevelDept(curDep);
		filter.addFilter("Q_department.depId_L_EQ", dep.getDepId().toString());
		filter.addSorted("archDepId","desc");
		List<ArchivesDep> list= archivesDepService.getAll(filter);
		//加载数据至awaitDownload
		getRequest().setAttribute("awaitDownload", list);
		return "display";
	}
}
