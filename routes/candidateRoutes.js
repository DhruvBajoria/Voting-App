const express = require("express");
const router = express.Router();

const User = require("./../models/user");
const Candidate = require("./../models/candidate");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    //console.log(user);
    return user.role === "admin";
  } catch (err) {
    console.log(err);
    return false;
  }
};

// post route to add a candidate
router.post("/",jwtAuthMiddleware, async (req, res) => {
  try {
      // console.log(req.user.user.id);
    if (!(await checkAdminRole(req.user.user.id))) {
      return res.status(404).json({message:"user is not admin"});
    }
      const data = req.body;
      const newCandidate = new Candidate(data);
      const response = await newCandidate.save();
      console.log("data saved");
      res.status(200).json({ response: response });
    
  } catch (err) {
      console.log(err);
      res.status(500).json({error:"Internal Server Error"});
  }
});

router.put('/:candidateId',jwtAuthMiddleware,async(req,res)=>{
      try{
            if (!checkAdminRole(req.user.user.id)) {
                  return res.status(404).json({message:"user is not admin"});
                }
             const candidateId = req.params.candidateId;
             const updatedCandidate = req.body;
             
             const response = await Candidate.findByIdAndUpdate(candidateId,updatedCandidate,{
                  new: true,
                  runValidators:true
             });

             if(!response)
             return res.status(404).json({message:"Candidate not found"});

             console.log('Candidate data updated');
             res.status(200).json(response);

      }catch(err){
            console.log(err);
            res.status(500).json({error:"Internal Server Error"});
      }
})

router.delete('/:candidateId',jwtAuthMiddleware,async(req,res)=>{
      try{
            if(!(await checkAdminRole(req.user.user.id))){
                  return res.status(401).json({message:"User is not admin"});
            }
            const candidateId = req.params.candidateId;

            const response = await Candidate.findByIdAndDelete(candidateId);
            if(!response){
                  return res.status(404).json({messgae:"Candidate not found"});

            }
            console.log('Candidate deleted');
            res.status(200).json({message:"Candudate Deleted Successfully"});


      }catch(err){
            console.log(err);
            res.status(500).json({error:"Internal Server Error"});
      }
});

router.post('/vote/:candidateId',jwtAuthMiddleware,async(req,res)=>{
      //no admin can vote
      //user can vote only once
      const candidateId = req.params.candidateId;
      const userId = req.user.user.id;
      try{
            const candidate = await Candidate.findById(candidateId);
            if(!candidate){
                  return res.status(404).json({message:"Candidate not found"});
            }
            const user = await User.findById(userId);
            if(!user){
                  return res.status(404).json({message:"User not found"});
            }
            if(user.role==='admin')
            {
                  return res.status(403).json({message:"Admin is not allowed to vote"});
            }
            if(user.isVoted){
                  return res.status(400).json({message:"User has already voted"});
            }

            candidate.votes.push({user:userId});
            candidate.voteCount++;
            await candidate.save();

            user.isVoted = true;
            await user.save();

            res.status(200).json({message:"Vote recorded successfully"});


      }catch(err){
            console.log(err);
            res.status(500).json({error:"Internal Server Error"});
      }
})

router.get('/vote/count', async(req,res)=>{
      try{
            const candidate = await Candidate.find().sort({voteCount:-1});

            const voteRecord = candidate.map((data)=>{
                  return{
                        party: data.party,
                        count:data.voteCount

                  }
            });
            return res.status(200).json(voteRecord);


      }catch(err){
            console.log(err);
            res.status(500).json({error:"Internal Server Error"});
      }
})


module.exports = router;
