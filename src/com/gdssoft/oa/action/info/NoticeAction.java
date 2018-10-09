package com.gdssoft.oa.action.info;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.lang.reflect.Type;
//import java.math.BigDecimal;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.Authentication;
import org.springframework.security.context.SecurityContextHolder;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.info.InfoType;
import com.gdssoft.oa.model.info.Notice;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.SysDataTransfer;
import com.gdssoft.oa.model.system.SysUserAll;
import com.gdssoft.oa.service.info.NoticeService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.Action;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author csx
 *
 */
public class NoticeAction extends BaseAction{
	@Resource
	private NoticeService noticeService;
	@Resource
	private DepartmentService departmentService;
	@Resource
	private FileAttachService fileAttachService;
	private Notice notice;
	private List<Notice> list;
	
	private Integer intAudit;
	private Integer intType;//该字段用于区分公司公告/部门公告/部门文件
	
	public List<Notice> getList() {
		return list;
	}

	public void setList(List<Notice> list) {
		this.list = list;
	}
	private Long noticeId;

	public Long getNoticeId() {
		return noticeId;
	}

	public void setNoticeId(Long noticeId) {
		this.noticeId = noticeId;
	}

	public Notice getNotice() {
		return notice;
	}

	public void setNotice(Notice notice) {
		this.notice = notice;
	}

	//标记是公司公告还是部门公告  add by smart on 20110513
/*	private Integer actionFlag;
	
	public Integer getActionFlag() {
		return actionFlag;
	}

	public void setActionFlag(Integer actionFlag) {
		this.actionFlag = actionFlag;
	}*/
	
	//add by smart on 20110515 审核事件:包含了同意和拒绝
	private String auditingAction;
		
	public String getAuditingAction() {
		return auditingAction;
	}
	
	public void setAuditingAction(String auditingAction) {
		this.auditingAction = auditingAction;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		// 获取当前用户
		Authentication auth = SecurityContextHolder.getContext()
				.getAuthentication();
		AppUser user = (AppUser) auth.getPrincipal();
		Long depId = departmentService.get3LevelDept(user.getDepartment()).getDepId();
		
 		QueryFilter filter=new QueryFilter(getRequest());	
 
		//add by smart on 20110513
/*		if(this.actionFlag.equals(0))
		{
			//filter.addFilter("Q_department.depId_L_EQ", "0");//如果用户点击的是左边菜单的公司公告管理,则赋depId为"0"
			filter.addFilter("Q_depId_L_EQ", "0");//如果用户点击的是左边菜单的公司公告管理,则赋depId为"0" 
		}
		else if(this.actionFlag.equals(1))
		{
			filter.addFilter("Q_depId_L_EQ", depId.toString());//如果用户点击的是左边菜单的公司公告管理,则赋depId为登录用户的部门ID 
		}*/
/*		System.out.println("intAudit:==="+this.intAudit);
		System.out.println("this.actionFlag:==="+this.actionFlag);*/

 		//是否需要审核，为了不查找出草稿数据 0为草稿 　1为有效　2为失效
/*		if(this.intAudit!=null && this.intAudit==1)
		{
			filter.addFilter("Q_state_SN_EQ","1");
		}*/
		
		
		
		//intType:　1 代表公司公告　2代表部门公告　3代表部门文件
		/*if(this.intType!=null&& this.intType==1)
		{
			filter.addFilter("Q_depId_L_EQ", "0");//如果用户点击的是左边菜单的公司公告管理,则赋depId为"0" 
			filter.addFilter("Q_type_N_EQ","1");
		}
		else if(this.intType!=null&& this.intType==2)
		{
			filter.addFilter("Q_depId_L_EQ", depId.toString());//如果用户点击的是左边菜单的部门公告管理,则赋depId为登录用户的部门ID 
			filter.addFilter("Q_type_N_EQ","2");
		}
		else if(this.intType!=null&& this.intType==3)
		{
			filter.addFilter("Q_depId_L_EQ", depId.toString());//如果用户点击的是左边菜单的部门文件管理,则赋depId为登录用户的部门ID 
			filter.addFilter("Q_type_N_EQ","3");
		}*/
		
 		filter.addSorted("createtime", "desc");
 		filter.addSorted("updateTime", "desc");
		
		List<Notice> list= noticeService.getAll(filter);
		
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "effectiveDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				"expirationDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				"createtime");
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
		"updateTime");
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
		"auditingCreateDate");		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(
				",result:");
        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
		.create();
        buff.append(gson.toJson(list));
		
/*		Type type=new TypeToken<List<Notice>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");

		buff.append(serializer.exclude(new String[] {"class"}).exclude(new String[]{"noticeContent"})
				.serialize(list));//序列化时剔除noticeContent，该字段太长，可能引起内存溢出--Super 20110905
*/		buff.append("}");
		
//		Gson gson=new Gson();
//		buff.append(gson.toJson(list, type));
//		buff.append("}");
		
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
				noticeService.remove(new Long(id));
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
		Notice notice=noticeService.get(noticeId);
		
//		JSONSerializer serializer=new JSONSerializer();
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.setDateFormat("yyyy-MM-dd").create();
		/*serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),"effectiveDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),"expirationDate");*/
		
//		StringBuffer sb = new StringBuffer("{success:true,data:");
		StringBuffer sb = new StringBuffer("{success:true,data:[");
//		sb.append(serializer.exclude(new String[]{"class"}).serialize(notice));
		sb.append(gson.toJson(notice));
//		sb.append("}");
		sb.append("]}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		boolean res = true;
		// 获取当前用户
		String fileIds = getRequest().getParameter("fileIds");
		if (StringUtils.isNotEmpty(fileIds)) {
			notice.getAttachFiles().clear();
			String[] fIds = fileIds.split(",");
			for (int i = 0; i < fIds.length; i++) {
				FileAttach fileAttach = fileAttachService.get(new Long(fIds[i]));
				notice.getAttachFiles().add(fileAttach);
			}
		}
		if (null==notice.getNoticeId()){
		Authentication auth = SecurityContextHolder.getContext()
				.getAuthentication();
		AppUser user = (AppUser) auth.getPrincipal();
		//取部门ID，部门为第三级
		Long depId = departmentService.get3LevelDept(user.getDepartment()).getDepId();
		
 		//add by smart on 20110513
/*		if(this.actionFlag.equals(0))
		{
		 notice.setDepId(0L);// 如果用户点击的是左边菜单的公司公告管理,则赋depId为0L
		}
		else if(this.actionFlag.equals(1))
		{
			notice.setDepId(depId);//如果用户点击的是左边菜单的公司公告管理,则赋depId为登录用户的部门ID 
		}*/
		
		notice.setDepId(depId); //edit on 0715 

		if(this.intType.equals(1))
		{
//			notice.setDepId(0L);// 如果用户点击的是左边菜单的公司公告管理,则赋depId为0L
			notice.setType(1); 
		}
		else if(this.intType.equals(2)) 
		{
			//notice.setDepId(depId);//如果用户点击的是左边菜单的公司公告管理,则赋depId为登录用户的部门ID 
			notice.setType(2);
		}
		else if(this.intType.equals(3)) 
		{
			//notice.setDepId(depId);//如果用户点击的是左边菜单的部门文件管理,则赋depId为登录用户的部门ID 
			notice.setType(3);
		}
//		notice.setAuditingStatus(0);//让审核状态默认为0
		notice.setReplyCounts(0);
		notice.setViewCounts(0);
		
		notice.setOrdertop(0);//初始化为未置顶
		String searchContent = getRequest().getParameter("searchContent");
		
		noticeService.save(notice);}
		else{
			Notice notic = noticeService
					.get(notice.getNoticeId());
			try {
				BeanUtil.copyNotNullProperties(notic,notice);
				notic.setUpdateUser(ContextUtil.getCurrentUser()
						.getUsername());
				notic.setUpdateTime(new Date());
				noticeService.save(notic);
			} catch (Exception ex) {
				res = false;
				ex.printStackTrace();
			}
		}
		setJsonString("{success:" + res + "}");
		return SUCCESS;
	}
	
	
	/**
	 * 审核公告 add by smart on 20110515
	 */
	public String update()
	{ 
 		// 获取当前用户
 		Authentication auth = SecurityContextHolder.getContext()
 				.getAuthentication();
 		AppUser user = (AppUser) auth.getPrincipal();
 		//取部门ID
 		Long depId = departmentService.get3LevelDept(user.getDepartment()).getDepId();
 		String userFullName = user.getFullname().toString(); 
 		
		System.out.println("notice.getNoticeId():"+notice.getNoticeId());
		Notice old = new Notice();
		old = noticeService.get(notice.getNoticeId());
		
		notice.setNoticeId(notice.getNoticeId()); 	//需要更新的noticeId
		notice.setAuditingPerson(userFullName);
		notice.setAuditingCreateDate(new Date()); 
		
		notice.setUpdateTime(new Date());
		
		notice.setEffectiveDate(notice.getEffectiveDate());
		
		notice.setPostName(old.getPostName());
		notice.setNoticeTitle(old.getNoticeTitle());
		notice.setNoticeContent(old.getNoticeContent());
		notice.setViewCounts(old.getViewCounts());
		notice.setReplyCounts(old.getReplyCounts());
		
		notice.setEffectiveDate(old.getEffectiveDate());
		notice.setExpirationDate(old.getExpirationDate());
		notice.setCreatetime(old.getCreatetime());
		
		notice.setOrdertop(old.getOrdertop());
		

		
 		//add by smart on 20110513
	//	System.out.println("this.actionFlag:::: "+this.actionFlag);
/*		if(this.actionFlag.equals(0))
		{
		 notice.setDepId(0L);// 如果用户点击的是左边菜单的公司公告管理,则赋depId为0L
		}
		else if(this.actionFlag.equals(1))
		{
			notice.setDepId(depId);//如果用户点击的是左边菜单的公司公告管理,则赋depId为登录用户的部门ID 
		}*/
		
		if(this.intType!=null&&this.intType.equals(1))
		{
//			notice.setDepId(0L);// 如果用户点击的是左边菜单的公司公告管理,则赋depId为0L
			notice.setType(1); 
		}
		else if(this.intType!=null&&this.intType.equals(2)) 
		{
//			notice.setDepId(depId);//如果用户点击的是左边菜单的公司公告管理,则赋depId为登录用户的部门ID 
			notice.setType(2);
		}
		else if(this.intType!=null&&this.intType.equals(3)) 
		{
//			notice.setDepId(depId);//如果用户点击的是左边菜单的部门文件管理,则赋depId为登录用户的部门ID 
			notice.setType(3);
		}
		
		//notice.setDepId(depId);
		
		if(this.auditingAction.equals("agree"))
		{
			notice.setAuditingStatus(1);//1代表同意
		}
		else if(this.auditingAction.equals("disagree"))
		{
			notice.setAuditingStatus(2); //2代表拒绝
		}else if (this.auditingAction.equals("invalidation")) {
			
			notice.setAuditingStatus(old.getAuditingStatus());
			
			notice.setState(Short.valueOf("2"));  // 2代表禁止/失效
		}
		 
		noticeService.merge(notice); 
		setJsonString("{success:true}");
 		return Action.SUCCESS;
	}
	
	

	/**
	 * 首页公告查询,该方法按输入的字段模糊查询公告标题和公告内容
	 * @return
	 */
	public String search(){
		PagingBean pb = getInitPagingBean();
		String searchContent = getRequest().getParameter("searchContent");
		List<Notice> list = noticeService.findBySearch(searchContent,pb);
		Type type=new TypeToken<List<Notice>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(pb.getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 首页公告显示列表   edit by smart on 20110520 加入了审核状态栏位的条件
	 * @return
	 */
	public String display(){
		PagingBean pb = new PagingBean(0,8);
		List<Notice> list = noticeService.findBySearch(null,pb);//1指的是 审核通过
		getRequest().setAttribute("noticeList", list);
		return "display";
	}
	
	
	public String scroller(){
		
		PagingBean pb = new PagingBean(0,8);
		List<Notice> list = noticeService.findBySearch(null,pb);
		getRequest().setAttribute("noticeList", list);
		return "scroller";
	}
	
	
	/**
	 * 新闻置顶功能   该功能主要是把news的setTop字段更新为1,然后把updatetime更新为当前时间
	 * 在门户网站上看新闻的时候的SQL语句需要根据updatetime倒序排和setTop顺序排
	 */
	public String sort(){
		Integer opt = Integer.valueOf(getRequest().getParameter("opt"));
		Long sortId = Long.valueOf(getRequest().getParameter("sortId"));
 		//if(opt==1){//	1:置顶	 0:未置顶 
 			
 			Notice notice = new Notice();
 			
 			Notice old = new Notice();
 			old = noticeService.get(sortId);// 因为updatetime和createtime都不允许为空
 			
/*           if(opt==1)
           {
 			notice.setUpdateTime(new Date());
           }
           else
           {*/
        	   notice.setUpdateTime(old.getUpdateTime());
          // }
           
 			notice.setCreatetime(old.getCreatetime());
 			notice.setState(old.getState());
 			
 			notice.setViewCounts(old.getViewCounts());
 			notice.setReplyCounts(old.getReplyCounts());
  			notice.setDepId(old.getDepId());
  			notice.setPostName(old.getPostName());
  			notice.setNoticeTitle(old.getNoticeTitle());
  			notice.setNoticeContent(old.getNoticeContent());
   			
 			notice.setNoticeId(sortId); // 需要更新的noticeId
 			
 			notice.setOrdertop(opt);
 			
 			notice.setEffectiveDate(old.getEffectiveDate());
 			notice.setExpirationDate(old.getExpirationDate());
   			
 			notice.setAuditingPerson(old.getAuditingPerson());
 			notice.setAuditingCreateDate(old.getAuditingCreateDate());
 
 			notice.setAuditingStatus(old.getAuditingStatus());// 1代表同意
 			
 			notice.setType(old.getType());
 			
 			
 			noticeService.merge(notice);
 			
 			setJsonString("{success:true}");
 			
 			//return Action.SUCCESS;
 			
		//} 
		return SUCCESS;
	}
	/**
	 * 显示党群信息列表
	 */
	public String partyList(){
 		QueryFilter filter=new QueryFilter(getRequest());
		if(this.intType!=null&& this.intType==2)
		{
			filter.addFilter("Q_type_N_EQ","2");
		}
 		filter.addSorted("createtime", "desc");
 		filter.addSorted("updateTime", "desc");
		List<Notice> list= noticeService.getAll(filter);
		for(Notice notice:list){
			InfoType infoType=notice.getInfoType();
			if(infoType!=null){
				notice.setAuditingPerson(infoType.getTypeName());
			}
		}
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "effectiveDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				"expirationDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				"createtime");
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
		"updateTime");
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
		"auditingCreateDate");		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(
				",result:");
        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
		.create();
        buff.append(gson.toJson(list));
		buff.append("}");
		
		jsonString=buff.toString();
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String getPartyDetail(){
		Notice notice=noticeService.get(noticeId);
		if(notice.getInfoType()!=null){
			notice.setInfoTypeId(notice.getInfoType().getTypeid());
		}
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.setDateFormat("yyyy-MM-dd").create();
		StringBuffer sb = new StringBuffer("{success:true,data:[");
		sb.append(gson.toJson(notice));
		sb.append("]}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 党群信息桌面显示模块
	 * @return
	 */
	public String partyDisplay() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_type_N_EQ","2");
		filter.addSorted("createtime", "desc");
		List<Notice> list= noticeService.getAll(filter);
		getRequest().setAttribute("partyInfoList", list);
		return "partyInfoDisplay";
	}
	
	public Integer getIntAudit() {
		return intAudit;
	}

	public void setIntAudit(Integer intAudit) {
		this.intAudit = intAudit;
	}

	public Integer getIntType() {
		return intType;
	}

	public void setIntType(Integer intType) {
		this.intType = intType;
	}

 
	
}
